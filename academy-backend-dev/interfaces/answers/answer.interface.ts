import {AnswerStatuses} from '@utils/enums';

export interface Answer {
  status: AnswerStatuses;
  mark: number;
  body: string;
  executionTime: number;
}
