import {Schema, model} from 'mongoose';

const UsersSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true}
});

export const Users = model('users', UsersSchema);
