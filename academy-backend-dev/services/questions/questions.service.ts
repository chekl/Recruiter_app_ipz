import {Question, EditQuestionPayload} from 'interfaces';
import {questionsRepository} from 'repositories';
import {Query} from 'express-serve-static-core';
import {capitalizeFirstLetter, convertRequestQueryToGetQuestions} from '@utils/helpers';
import {validateCreateQuestion, validateEditQuestion} from 'services/questions/questions.validate';
import {CollationOptions} from 'mongodb';

class QuestionsService {
  async getList(query: Query) {
    const {filters, sorting, page, limit} = await convertRequestQueryToGetQuestions(query);
    const collation: CollationOptions = {locale: 'en', caseLevel: false, strength: 1};

    const questions = await questionsRepository
      .find(filters)
      .collation(collation)
      .skip(page * limit)
      .sort([[sorting.field, sorting.order]])
      .populate('topics type')
      .limit(limit)
      .lean();

    if (Object.keys(filters).length) {
      const amount = await this.getAmount(filters);
      return [questions, amount];
    }

    const amount = await this.getAmount({});

    return [questions, amount];
  }

  async getOne(id: string) {
    return questionsRepository.findById(id).populate('topics type').lean();
  }

  async createQuestion(payload: Question) {
    const data = await validateCreateQuestion(payload);

    data.title = capitalizeFirstLetter(data.title);
    data.description = capitalizeFirstLetter(data.description);

    return (await questionsRepository.createOne(data)).populate('topics type');
  }

  async updateQuestion(id: string, payload: EditQuestionPayload) {
    const data = await validateEditQuestion(payload);

    data.title = capitalizeFirstLetter(data.title);
    data.description = capitalizeFirstLetter(data.description);

    return questionsRepository.findByIdAndUpdate(id, data, {new: true}).populate('topics type');
  }

  async deleteQuestion(id: string) {
    return questionsRepository.deleteOne({_id: id});
  }

  private async getAmount(filters: {[key: string]: any}) {
    const questions = await questionsRepository.find(filters).populate('topics type').lean();
    return questions.length;
  }
}

export const questionsService = new QuestionsService();
