import {Questions} from 'models';
import BaseRepository from './base.repository';
import {Question} from 'interfaces';

export default class QuestionsRepository extends BaseRepository<Question> {
  constructor() {
    super(Questions);
  }
}
