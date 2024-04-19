import {Question} from 'interfaces';
import {Schema} from 'mongoose';
import {AnswerStatuses} from '@utils/enums';
import {AnswerSchema} from './answers.model';

export const ApplicationQuestionsSchema = new Schema<Omit<Question, 'vacancies'>>({
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
  answer: {
    type: AnswerSchema,
    default: {
      status: AnswerStatuses.NOT_ANSWERED
    },
    unique: false
  }
});
