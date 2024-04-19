import {Vacancy} from './vacancy.interface';

export interface EditVacancyPayload extends Omit<Partial<Vacancy>, 'questions'> {}
