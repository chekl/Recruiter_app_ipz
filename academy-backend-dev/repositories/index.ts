import QuestionsRepository from './questions.repository';
import VacanciesRepository from './vacancies.repository';
import TopicsRepository from './topics.repository';
import QuestionTypesRepository from './question-types.repository';
import UserRepository from './user.repository';
import VacancyTypesRepository from './vacancy-types.repository';
import CandidateRepository from './candidate.repository';
import ApplicationRepository from './applications.repository';

export const topicsRepository = new TopicsRepository();
export const vacanciesRepository = new VacanciesRepository();
export const questionsRepository = new QuestionsRepository();
export const questionTypesRepository = new QuestionTypesRepository();
export const userRepository = new UserRepository();
export const vacancyTypesRepository = new VacancyTypesRepository();
export const candidateRepository = new CandidateRepository();
export const applicationRepository = new ApplicationRepository();
