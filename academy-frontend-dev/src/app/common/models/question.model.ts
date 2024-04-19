export interface Question {
  _id: string;
  title: string;
  topics: QuestionTopic[];
  description: string;
  time: number;
  type: QuestionType;
  vacancies: string[];
}

export interface QuestionForServer {
  title: string;
  topics: string[];
  description: string;
  time: number;
  type: string;
}

export interface QuestionType {
  _id: string;
  name: string;
  link: string;
}

export interface QuestionTopic {
  _id: string;
  name: string;
}

export interface QuestionQueryParams {
  [key: string]: string | string[] | null;
}

export interface QuestionOptions {
  usePrevParams: boolean;
  filter: QuestionQueryParams | null;
  update?: boolean;
}

export interface QuestionToCreateApplication {
  title: string;
  topics: string[];
  description: string;
  time: number;
  type: string;
}
