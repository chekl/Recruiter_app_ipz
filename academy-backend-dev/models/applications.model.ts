/* eslint-disable no-useless-catch */
import {ApplicationStatuses} from 'utils/enums';
import {Application, Question} from 'interfaces';
import {Document, FilterQuery, Schema, UpdateQuery, UpdateWriteOpResult, model} from 'mongoose';
import {applicationRepository, vacanciesRepository} from 'repositories';
import {badRequest, notFoundRequest} from '@utils/error';
import {calculateApplicationScore} from '@utils/helpers';
import {ApplicationQuestionsSchema} from './application-questions.model';

const ApplicationSchema = new Schema<Application>(
  {
    vacancy: {
      type: Schema.Types.ObjectId,
      ref: 'vacancies',
      required: true
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'candidates',
      required: true
    },
    status: {
      type: String,
      enum: ApplicationStatuses,
      default: ApplicationStatuses.INVITED,
      required: true
    },
    invited: {
      type: Date
    },
    completed: {
      type: Date,
      required: false
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    score: {
      type: Number,
      required: false
    },
    questions: {
      type: [ApplicationQuestionsSchema],
      required: true,
      validate: function (arr: Omit<Question, 'vacancies'>[]) {
        return arr.length <= 20;
      }
    },
    executionTime: {
      type: Number,
      required: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

ApplicationSchema.pre('deleteOne', async function (next) {
  const filter: FilterQuery<Document & Application> = this.getQuery();
  const application = await applicationRepository.findById(filter._id);
  if (!application) {
    throw notFoundRequest('Application not found', 'not_found');
  }
  if (application.status === ApplicationStatuses.IN_PROGRESS) {
    throw badRequest('Application is in progress', 'bad_request');
  }
  next();
});

ApplicationSchema.pre('save', async function (next) {
  if (this.questions.length < 1) {
    throw badRequest('Question list cannot be empty', 'bad_request');
  }
  this.executionTime = this.questions.reduce(
    (accumulator, currentValue) => accumulator + currentValue.time,
    0
  );
  next();
});

ApplicationSchema.post(
  'findOne',
  async function (
    doc: Document & {questions: Question[]; executionTime: number} & Application,
    next
  ) {
    if (!doc) {
      throw notFoundRequest('Application not found', 'not_found');
    }
    next();
  }
);

ApplicationSchema.post('updateOne', function (doc: UpdateWriteOpResult, next) {
  if (doc.matchedCount === 0) {
    throw notFoundRequest('Application not found', 'not_found');
  }

  next();
});

ApplicationSchema.pre('findOneAndUpdate', function (next) {
  const updatedDocument: UpdateQuery<Document & Question> = this.getUpdate();

  if (updatedDocument.questions?.every(question => question.answer.mark)) {
    const candidateScore = calculateApplicationScore(updatedDocument.questions);

    this.set({score: candidateScore});
  }
  next();
});

ApplicationSchema.post('deleteMany', async function (doc, next) {
  const filter: FilterQuery<Document & Application> = this.getQuery();

  await vacanciesRepository.updateMany(
    {applications: filter._id},
    {$pull: {applications: filter._id}}
  );
  next();
});

ApplicationSchema.post('save', async function (doc, next) {
  const filter: FilterQuery<Document & Application> = doc.vacancy;
  const vacancy = await vacanciesRepository.findById(filter._id);

  if (!vacancy) {
    throw notFoundRequest('Vacancy not found', 'not_found');
  }
  if (vacancy.status === 'Closed') {
    throw badRequest('Vacancy is closed', 'bad_request');
  }

  await vacanciesRepository.updateOne({_id: filter._id}, {$push: {applications: doc._id}});
  next();
});

export const Applications = model('applications', ApplicationSchema);
