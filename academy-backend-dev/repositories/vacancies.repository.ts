import BaseRepository from './base.repository';
import {Vacancies} from '../models';
import {Vacancy} from 'interfaces';

export default class VacanciesRepository extends BaseRepository<Vacancy> {
  constructor() {
    super(Vacancies);
  }
}
