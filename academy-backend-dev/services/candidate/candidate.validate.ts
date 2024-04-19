import {Candidate} from 'interfaces';
import Joi from 'joi';
import {validate} from '@utils/joi';

export function validateCreateCandidate(payload: Candidate) {
  const schema = Joi.object<Candidate>({
    firstName: Joi.string().trim().min(2).max(20).required(),
    lastName: Joi.string().trim().min(2).max(20).required(),
    email: Joi.string().email().required()
  });

  return validate(schema, payload);
}
