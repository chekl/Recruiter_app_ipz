import {User} from 'interfaces';

function getFullName(user: User) {
  return user.firstName + ' ' + user.lastName;
}

export {getFullName};
