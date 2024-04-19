import {Types} from 'mongoose';

export interface Vacancy {
  title: string;
  description: string;
  link?: string;
  status: string;
  type: Types.ObjectId;
  applications?: [Types.ObjectId];
  questions: [Types.ObjectId];
  opened: Date;
}
