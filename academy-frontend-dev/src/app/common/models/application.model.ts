import {ApplicationStatuses} from 'src/app/common/enums/enums';
import {
  Question,
  QuestionForServer,
  QuestionToCreateApplication
} from 'src/app/common/models/question.model';
import {Candidate} from 'src/app/common/models/candidate.model';
import {Vacancy} from 'src/app/common/models/vacancy.model';
import {User} from 'src/app/common/models/user.model';

export interface Answer {
  status: 'Answered' | 'Not answered' | 'Evaluated';
  mark: number;
  body: string;
  executionTime: number;
}

export interface QuestionWithAnswerServer extends Omit<Question, '_id vacancies'> {
  answer?: Partial<Answer>;
}

export interface QuestionWithAnswerSimple {
  title: string;
  topics: string[];
  description: string;
  time: number;
  type: string;
  answer?: Partial<Answer>;
}

export type ApplicationStatus = 'Invited' | 'In progress' | 'Evaluated' | 'Completed' | 'Closed';

export interface Application {
  _id: string;
  status: ApplicationStatus;
  vacancy: Vacancy;
  questions: QuestionWithAnswer[];
  score?: number;
  rank?: number;
  reviewer: User;
  candidate: Candidate;
  creator: string;
  completed?: Date;
  invited: Date;
  executionTime: number;
}

export interface QuestionWithAnswer extends Partial<Question> {
  answer?: Partial<Answer>;
}

export interface QuestionWithAnswerForServer extends Partial<QuestionForServer> {
  answer?: Partial<Answer>;
}

export interface Reviewer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApplicationUpdate {
  reviewer?: string;
  status?: ApplicationStatuses;
  invited?: number;
  completed?: string;
  score?: number;
  questions?: Question[];
}

export interface ApplicationCreate {
  vacancy: string;
  reviewer: string;
  candidate: string;
  creator: string;
  invited: number;
  questions: QuestionToCreateApplication[];
}
