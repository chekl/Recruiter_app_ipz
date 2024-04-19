import BaseRepository from './base.repository';
import {Topics} from '../models';
import {Topic} from 'interfaces';

export default class TopicsRepository extends BaseRepository<Topic> {
  constructor() {
    super(Topics);
  }
}
