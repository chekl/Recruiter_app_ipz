import {Question} from 'interfaces/questions/question.interface';
import {Types} from 'mongoose';
export interface Application {
  _id: Types.ObjectId;
  vacancy: Types.ObjectId;
  reviewer: Types.ObjectId;
  candidate: Types.ObjectId;
  status: string;
  invited: Date;
  completed?: Date;
  creator: Types.ObjectId;
  score?: number;
  questions: [Question];
  executionTime: number;
  rank?: number;
}
