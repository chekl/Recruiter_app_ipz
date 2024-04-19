import {VacancyType} from 'interfaces';
import {Schema, model} from 'mongoose';

const VacancyTypesSchema = new Schema<VacancyType>(
  {
    name: {type: String, maxlength: 20, required: true, unique: true}
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const VacancyTypes = model('vacancy_types', VacancyTypesSchema);
