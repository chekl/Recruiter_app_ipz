import {Question} from 'src/app/common/models/question.model';
import {Application} from 'src/app/common/models/application.model';

export interface Vacancy {
  _id: string;
  title: string;
  type: VacancyType;
  status: string;
  description: string;
  link?: string;
  questions: Question[];
  executionTime: number;
  opened: string;
  applications: Application[];
}

export interface VacancyType {
  _id: string;
  name: string;
}

export interface VacancyCreationData
  extends Omit<
    Vacancy,
    '_id' | 'type' | 'status' | 'questions' | 'executionTime' | 'opened' | 'applications'
  > {
  type: string[];
  questions: string[];
  applications?: string[];
}

export interface VacancyEditData extends Omit<VacancyCreationData, 'questions'> {}

export interface VacancyOptions {
  status: string;
  opened: string;
  page: number;
}

export interface VacancyStatus extends Partial<Pick<Vacancy, 'status' | 'opened'>> {}
