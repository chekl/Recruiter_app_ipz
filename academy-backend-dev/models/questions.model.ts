import {badRequest, notFoundRequest} from 'utils/error';
import {Question} from 'interfaces';
import {FilterQuery, Schema, Types, UpdateWriteOpResult, model} from 'mongoose';
import {DeleteResult} from 'mongodb';
import {vacanciesRepository} from 'repositories';

const QuestionsSchema = new Schema<Question>({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 250
  },
  topics: {
    type: [Schema.Types.ObjectId],
    ref: 'topics',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 800
  },
  time: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'question_types',
    required: true
  },
  vacancies: {
    type: [Schema.Types.ObjectId],
    ref: 'vacancies'
  }
});

QuestionsSchema.pre('deleteOne', async function (next) {
  const filter: FilterQuery<{_id: Types.ObjectId} & Question> = this.getQuery();
  const vacancies = await vacanciesRepository.find({questions: new Types.ObjectId(filter._id)});
  if (vacancies.length > 0) {
    throw badRequest('Question in use', 'bad_request');
  }
  next();
});

QuestionsSchema.post('findOne', function (doc, next) {
  if (!doc) {
    throw notFoundRequest('Question not found', 'not_found');
  }
  next();
});

QuestionsSchema.post('findOneAndUpdate', function (doc: UpdateWriteOpResult, next) {
  if (!doc) {
    throw notFoundRequest('Question not found', 'not_found');
  }
  next();
});

QuestionsSchema.post('deleteOne', function (doc: DeleteResult, next) {
  if (doc.deletedCount === 0) {
    throw notFoundRequest('Question not found', 'not_found');
  }
  next();
});

export const Questions = model('questions', QuestionsSchema);
