import {QuestionWithAnswer} from 'src/app/common/models/application.model';

export interface ModalQuestion {
  isCandidate: boolean;
  question: QuestionWithAnswer;
  currentQuestion: number;
  amountOfQuestions: number;
}
