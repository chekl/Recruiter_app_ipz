import {userRepository} from 'repositories';

class ReviewerService {
  async getFilteredReviewers(email: string) {
    return userRepository.find({email: {$regex: new RegExp(email, 'i')}});
  }
}

export default new ReviewerService();
