import {Application, EditApplicationPayload} from 'interfaces';
import {SortOrder, Types} from 'mongoose';
import {validateCreateApplication, validateEditeApplication} from './applications.validate';
import {applicationRepository} from 'repositories';
import {ApplicationStatuses} from '@utils/enums';
import {ObjectId} from 'mongodb';

interface ApplicationQuery {
  page?: number;
  limit?: number;
  status?: SortOrder;
  invited?: SortOrder;
  completed?: SortOrder;
}

class ApplicationsService {
  private getOnePopulation = [
    {
      path: 'questions',
      populate: [
        {path: 'type', model: 'question_types'},
        {path: 'topics', model: 'topics'}
      ]
    },
    {
      path: 'vacancy',
      populate: [
        {
          path: 'type',
          model: 'vacancy_types'
        }
      ]
    }
  ];

  async getList(query: ApplicationQuery) {
    const {status, invited, page = 1, limit} = query;
    const sortOptions = {...(status && {status}), ...(invited && {invited})};

    return applicationRepository
      .find({})
      .sort({...sortOptions, createdAt: -1})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reviewer candidate')
      .lean();
  }

  async getNeedReview(reviewerId: string, query: ApplicationQuery) {
    return applicationRepository
      .find({
        reviewer: new Types.ObjectId(reviewerId),
        status: ApplicationStatuses.COMPLETED
      })
      .populate('candidate')
      .populate({path: 'vacancy', populate: 'type'})
      .sort({completed: query.completed ?? 'desc'});
  }

  async getOneForCandidate(id: string) {
    return applicationRepository.findById(id).populate(this.getOnePopulation).lean();
  }

  async getOneForAdmin(id: string) {
    const application = await applicationRepository
      .findById(id)
      .populate(this.getOnePopulation)
      .populate('reviewer candidate')
      .lean();

    if (Object.prototype.hasOwnProperty.call(application, 'score')) {
      application.score = +application.score.toFixed();
      application.rank = await this.getApplicationRank(id);
    }

    return application;
  }

  async createApplication(payload: Application) {
    const data = await validateCreateApplication(payload);

    return (await applicationRepository.createOne(data)).populate('reviewer candidate');
  }

  async updateApplication(id: string, payload: EditApplicationPayload) {
    const data = await validateEditeApplication(payload);

    return applicationRepository
      .findByIdAndUpdate(id, data, {new: true})
      .populate(this.getOnePopulation)
      .populate('reviewer candidate')
      .lean();
  }

  async updateApplications(payload: {keys: string[]; data: EditApplicationPayload}) {
    const data = await validateEditeApplication(payload.data);

    await applicationRepository.updateMany({_id: payload.keys}, data);
    return await applicationRepository.find({_id: payload.keys}).populate('reviewer candidate');
  }

  async deleteApplications(id: string[]) {
    return applicationRepository.deleteMany({
      _id: {$in: id.map(id => new Types.ObjectId(id))}
    });
  }

  private async getApplicationRank(id: string) {
    const application = await applicationRepository.aggregate([
      {
        $setWindowFields: {
          partitionBy: '$vacancy',
          sortBy: {score: -1},
          output: {
            rank: {
              $rank: {}
            }
          }
        }
      },
      {$match: {_id: new ObjectId(id)}}
    ]);

    return application[0].rank;
  }
}

export const applicationsService = new ApplicationsService();
