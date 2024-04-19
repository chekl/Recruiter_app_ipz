import {User} from 'interfaces';
import {userRepository} from '../../repositories';
import {validateCreateUser} from './user.validate';
import {Types} from 'mongoose';

class AuthService {
  findUserByEmail(userEmail: string) {
    return userRepository.findOne({email: userEmail});
  }

  findUserById(userId: Types.ObjectId) {
    return userRepository.findById(userId, (err, result) => {
      if (err) {
        return null;
      } else {
        return result;
      }
    });
  }

  async createUser(payload: User) {
    const data = await validateCreateUser(payload);

    return userRepository.createOne(data);
  }
}

export default new AuthService();
