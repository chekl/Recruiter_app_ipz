import {Answer} from 'interfaces/answers/answer.interface';
import {Types} from 'mongoose';

export interface Question {
  title: string;
  topics: [Types.ObjectId];
  description: string;
  time: number;
  type: Types.ObjectId;
  vacancies: [Types.ObjectId];
  answer?: Answer;
}
