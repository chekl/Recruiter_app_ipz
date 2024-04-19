import {vacancyTypesRepository} from 'repositories';

class VacancyTypesService {
  getList() {
    return vacancyTypesRepository.find({});
  }
}

export default new VacancyTypesService();
