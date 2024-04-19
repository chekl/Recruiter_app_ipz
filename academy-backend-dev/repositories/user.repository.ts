import BaseRepository from './base.repository';
import {Users} from '../models';
import {User} from 'interfaces';

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(Users);
  }
}
