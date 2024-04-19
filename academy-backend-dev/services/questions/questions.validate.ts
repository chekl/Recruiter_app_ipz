import {EditQuestionPayload, Question} from 'interfaces';
import Joi from 'joi';
import {validate} from 'utils/joi';

export function validateCreateQuestion(payload: Question) {
  const schema = Joi.object<Question>({
    title: Joi.string().trim().min(3).max(250).required(),
    topics: Joi.array().items(Joi.string()).min(1).max(5).required(),
    type: Joi.string().hex().length(24).required(),
    description: Joi.string().trim().min(1).max(800).required(),
    time: Joi.number().min(1).required()
  });

  return validate(schema, payload);
}

export function validateEditQuestion(payload: EditQuestionPayload) {
  const schema = Joi.object<EditQuestionPayload>({
    title: Joi.string().trim().min(3).max(250),
    topics: Joi.array().items(Joi.string()).min(1).max(5),
    type: Joi.string().hex().length(24),
    description: Joi.string().trim().min(1).max(800),
    time: Joi.number().min(1)
  });

  return validate(schema, payload);
}
