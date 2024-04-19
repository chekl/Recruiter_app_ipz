import {VacancyStatuses} from 'utils/enums';
import {Question, Vacancy} from 'interfaces';
import {
  Document,
  FilterQuery,
  Schema,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
  model
} from 'mongoose';
import {
  applicationRepository,
  questionsRepository,
  vacanciesRepository,
  vacancyTypesRepository
} from 'repositories';
import {badRequest, notFoundRequest} from '@utils/error';

const VacanciesSchema = new Schema<Vacancy>(
  {
    title: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 200,
      required: true
    },
    description: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 800,
      required: true
    },
    link: {
      type: String,
      trim: true,
      maxlength: 2048
    },
    status: {
      type: String,
      enum: VacancyStatuses,
      default: VacancyStatuses.ACTIVE,
      required: true
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'vacancy_types',
      required: true
    },
    applications: {
      type: [Schema.Types.ObjectId],
      ref: 'applications'
    },
    questions: {
      type: [Schema.Types.ObjectId],
      ref: 'questions',
      required: true,
      immutable: true
    },
    opened: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

VacanciesSchema.pre('save', async function (next) {
  const vacancyTypeDoc = await vacancyTypesRepository.findOne({_id: this.type});
  if (!vacancyTypeDoc) {
    throw badRequest('This vacancy type does not exist', 'bad request');
  }
  next();
});

VacanciesSchema.pre('save', async function (next) {
  const docs = await questionsRepository.find({_id: {$in: this.questions}});
  if (docs.length < this.questions.length) {
    throw badRequest('Some of the questions do not exist', 'bad request');
  }
  next();
});

VacanciesSchema.pre('save', function (next) {
  if (this.questions.length < 1) {
    throw badRequest('Cannot create vacancy with no questions', 'bad request');
  }
  if (this.questions.length > 20) {
    throw badRequest('Cannot create vacancy with more than 20 questions', 'bad request');
  }
  next();
});

VacanciesSchema.pre('deleteOne', async function (next) {
  const filter: FilterQuery<Document & Vacancy> = this.getQuery();
  const vacancy = await vacanciesRepository.findById(filter._id);
  if (!vacancy) {
    throw notFoundRequest('Vacancy not found', 'not_found');
  }
  if (vacancy.status === 'Active') {
    throw badRequest('Vacancy is active', 'bad_request');
  }
  next();
});

VacanciesSchema.post(
  'findOne',
  async function (
    doc: Document & {
      questions: Question[];
      executionTime: number;
      applicationsCount: number;
    } & Vacancy,
    next
  ) {
    if (!doc) {
      throw notFoundRequest('Vacancy not found', 'not_found');
    }
    doc.executionTime = doc.questions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.time,
      0
    );
    next();
  }
);

VacanciesSchema.post('findOneAndUpdate', async function (doc: UpdateWriteOpResult, next) {
  if (!doc) {
    throw notFoundRequest('Vacancy not found', 'not_found');
  }
  next();
});

VacanciesSchema.pre('findOneAndUpdate', async function (next) {
  const filter = this.getFilter();
  const updateObject: UpdateQuery<Vacancy> = this.getUpdate();
  if (updateObject.status === 'Closed') {
    await applicationRepository.updateMany({vacancy: filter._id}, {status: 'Closed'});
  }
  next();
});

VacanciesSchema.post('deleteOne', async function (doc, next) {
  const filter: FilterQuery<Document & Vacancy> = this.getQuery();
  await questionsRepository.updateMany(
    {vacancies: new Types.ObjectId(filter._id)},
    {$pull: {vacancies: new Types.ObjectId(filter._id)}}
  );
  await applicationRepository.deleteMany({vacancy: new Types.ObjectId(filter._id)});
  next();
});

VacanciesSchema.post('save', async function (doc, next) {
  await questionsRepository.updateMany({_id: {$in: doc.questions}}, {$push: {vacancies: doc._id}});
  next();
});

export const Vacancies = model('vacancies', VacanciesSchema);
