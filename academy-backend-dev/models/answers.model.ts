import {AnswerStatuses} from '@utils/enums';
import {Answer} from 'interfaces';
import {Schema} from 'mongoose';

export const AnswerSchema = new Schema<Answer>(
  {
    status: {
      type: String,
      enum: AnswerStatuses,
      default: AnswerStatuses.NOT_ANSWERED,
      required: true
    },
    mark: {type: Number, min: 0, max: 10, required: false},
    body: {type: String, maxlength: 200, required: false},
    executionTime: {type: Number, required: false}
  },
  {_id: false}
);
