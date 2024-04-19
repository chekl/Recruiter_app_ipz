import {AnswerStatuses, ApplicationStatuses} from 'utils/enums';
import {EditApplicationPayload, Application, Question, Answer} from 'interfaces';
import Joi from 'joi';
import {validate} from 'utils/joi';

const answerSchema = Joi.object<Answer>({
  status: Joi.string().valid(...Object.values(AnswerStatuses)),
  mark: Joi.number().min(0).max(10),
  body: Joi.string().trim(),
  executionTime: Joi.number()
});

const questionSchema = Joi.object<Question>({
  title: Joi.string().trim().min(1).max(250).required(),
  topics: Joi.array().items(Joi.string()).min(1).max(5).required(),
  type: Joi.string().hex().length(24).required(),
  description: Joi.string().trim().min(1).max(800).required(),
  time: Joi.number().min(1).required(),
  answer: answerSchema
});

function validateCreateApplication(payload: Application) {
  const schema = Joi.object<Application>({
    vacancy: Joi.string().hex().length(24).required(),
    reviewer: Joi.string().hex().length(24).required(),
    candidate: Joi.string().hex().length(24).required(),
    invited: Joi.date(),
    creator: Joi.string().hex().length(24).required(),
    status: Joi.string().valid(...Object.values(ApplicationStatuses)),
    questions: Joi.array().items(questionSchema).required()
  });
  return validate(schema, payload);
}

function validateEditeApplication(payload: EditApplicationPayload) {
  const schema = Joi.object<EditApplicationPayload>({
    reviewer: Joi.string().hex().length(24),
    status: Joi.string().valid(...Object.values(ApplicationStatuses)),
    invited: Joi.date(),
    completed: Joi.date(),
    score: Joi.number().min(0).max(100),
    questions: Joi.array().items(questionSchema)
  });
  return validate(schema, payload);
}

export {validateCreateApplication, validateEditeApplication};
