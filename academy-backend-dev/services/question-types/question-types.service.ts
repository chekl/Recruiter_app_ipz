import {questionTypesRepository} from 'repositories';

class QuestionTypesService {
  async getList() {
    return questionTypesRepository.find({});
  }
}

export default new QuestionTypesService();
