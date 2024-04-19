import {VacancyStatuses} from 'utils/enums';
import {EditVacancyPayload, Vacancy} from 'interfaces';
import Joi from 'joi';
import {validate} from 'utils/joi';

function validateCreateVacancy(payload: Vacancy) {
  const schema = Joi.object<Vacancy>({
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().trim().min(1).max(800).required(),
    link: Joi.string().trim().max(2048).uri().optional(),
    type: Joi.string().hex().length(24).required(),
    questions: Joi.array().items(Joi.string().hex().length(24)).required().max(20).min(1).unique(),
    applications: Joi.array().items(Joi.string().hex().length(24)).max(20).min(1).unique()
  });

  return validate(schema, payload);
}

function validateEditVacancy(payload: EditVacancyPayload) {
  const schema = Joi.object<EditVacancyPayload>({
    title: Joi.string().trim().min(1).max(200),
    description: Joi.string().trim().min(1).max(800),
    link: Joi.string().trim().max(2048).uri(),
    status: Joi.string().valid(...Object.values(VacancyStatuses)),
    type: Joi.string().hex().length(24),
    applications: Joi.array().items(Joi.string().hex().length(24)),
    opened: Joi.date()
  });

  return validate(schema, payload);
}

export {validateCreateVacancy, validateEditVacancy};
