import {QuestionType} from 'interfaces';
import BaseRepository from './base.repository';
import {QuestionTypes} from 'models';

export default class QuestionTypesRepository extends BaseRepository<QuestionType> {
  constructor() {
    super(QuestionTypes);
  }
}
