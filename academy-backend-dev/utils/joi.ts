import {Schema} from 'joi';
import {badRequest} from './error';

async function validate<T>(schema: Schema<T>, payload: T) {
  try {
    return await schema.validateAsync(payload);
  } catch (e) {
    const errorMessage = e.message.replaceAll('"', '');
    throw badRequest(errorMessage, 'validation_failed');
  }
}

export {validate};
