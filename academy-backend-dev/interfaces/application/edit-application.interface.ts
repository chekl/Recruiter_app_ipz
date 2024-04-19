import {Types} from 'mongoose';
import {ApplicationStatuses} from '@utils/enums';
import {Question} from 'interfaces/questions/question.interface';

export interface EditApplicationPayload {
  reviewer?: Types.ObjectId;
  status?: ApplicationStatuses;
  invited?: Date;
  completed?: Date;
  score?: number;
  questions?: [Question];
}
