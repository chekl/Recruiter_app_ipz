import {vacanciesRepository} from 'repositories';
import {validateCreateVacancy, validateEditVacancy} from './vacancies.validate';
import {EditVacancyPayload, Vacancy} from 'interfaces';
import {SortOrder} from 'mongoose';
import {capitalizeFirstLetter} from '@utils/helpers';

interface VacancyQuery {
  page?: string;
  status?: SortOrder;
  opened?: SortOrder;
}

class VacanciesService {
  private oneVacancyPopulation = [
    {
      path: 'questions',
      populate: [
        {path: 'type', model: 'question_types'},
        {path: 'topics', model: 'topics'}
      ]
    },
    {
      path: 'type'
    },
    {
      path: 'applications',
      populate: [
        {path: 'candidate', model: 'candidates'},
        {path: 'reviewer', model: 'users'}
      ]
    }
  ];

  async getList(query: VacancyQuery) {
    const limit = 20;
    const {status, opened, page} = query;
    const sortOptions = {...(status && {status}), ...(opened && {opened})};
    const offset = Number(page) * limit;
    const vacancies = await vacanciesRepository
      .find({})
      .sort({...sortOptions, createdAt: -1})
      .skip(offset)
      .limit(limit)
      .populate('type')
      .lean();
    const amount = await this.getAmount();

    return [amount, vacancies];
  }

  private async getAmount() {
    const vacancies = await vacanciesRepository.find({}).populate('type').lean();
    return vacancies.length;
  }

  async getOne(id: string) {
    return vacanciesRepository.findById(id).populate(this.oneVacancyPopulation).lean();
  }

  async createVacancy(payload: Vacancy) {
    const data = await validateCreateVacancy(payload);

    data.title = capitalizeFirstLetter(data.title);
    data.description = capitalizeFirstLetter(data.description);

    return (await vacanciesRepository.createOne(data)).populate(this.oneVacancyPopulation);
  }

  async updateVacancy(id: string, payload: EditVacancyPayload) {
    const data = await validateEditVacancy(payload);

    if (data.title) {
      data.title = capitalizeFirstLetter(data.title);
      data.description = capitalizeFirstLetter(data.description);
    }

    const updatedVacancy = await vacanciesRepository
      .findByIdAndUpdate(id, data, {new: true})
      .populate(this.oneVacancyPopulation);

    return updatedVacancy;
  }

  async deleteVacancy(id: string) {
    return vacanciesRepository.deleteOne({_id: id});
  }
}

export const vacanciesService = new VacanciesService();
