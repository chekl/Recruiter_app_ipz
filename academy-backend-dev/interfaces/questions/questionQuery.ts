export interface QuestionQuery {
  filters: {[key: string]: any};
  sorting: {[key: string]: any};
  page: number;
  limit: number;
}
