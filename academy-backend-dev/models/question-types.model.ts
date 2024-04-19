import {QuestionType} from 'interfaces';
import {Schema, model} from 'mongoose';

const questionTypeSchema = new Schema<QuestionType>(
  {
    name: {type: String, maxlength: 20, required: true, unique: true},
    link: {type: String, maxlength: 200, required: true}
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const QuestionTypes = model('question_types', questionTypeSchema);
