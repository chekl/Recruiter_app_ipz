import {Topic} from 'interfaces';
import {topicsRepository} from 'repositories';

class TopicsService {
  async getList() {
    return topicsRepository.find({});
  }

  async createTopic(payload: Topic) {
    return topicsRepository.createOne(payload);
  }
}

export default new TopicsService();
