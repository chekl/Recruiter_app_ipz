import * as Joi from 'joi';
import {validate} from 'utils/joi';

function validateCreateUser(payload) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required()
  });

  return validate(schema, payload);
}

export {validateCreateUser};
