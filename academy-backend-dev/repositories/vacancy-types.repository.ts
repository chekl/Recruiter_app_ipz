import BaseRepository from './base.repository';
import {VacancyTypes} from 'models';
import {VacancyType} from 'interfaces';

export default class VacancyTypesRepository extends BaseRepository<VacancyType> {
  constructor() {
    super(VacancyTypes);
  }
}
