import {Types} from 'mongoose';

export interface EditQuestionPayload {
  title?: string;
  topics?: [Types.ObjectId];
  description?: string;
  time?: number;
  type?: Types.ObjectId;
}
