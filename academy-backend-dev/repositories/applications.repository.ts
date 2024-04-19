import BaseRepository from './base.repository';
import {Applications} from '../models';
import {Application} from 'interfaces';

export default class ApplicationRepository extends BaseRepository<Application> {
  constructor() {
    super(Applications);
  }
}
