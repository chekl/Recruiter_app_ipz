import {Topic} from 'interfaces';
import Joi from 'joi';
import {validate} from 'utils/joi';

export function validateCreateTopic(payload: Topic) {
  const schema = Joi.object<Topic>({
    name: Joi.string().trim().min(1).max(250).required()
  });

  return validate(schema, payload);
}
