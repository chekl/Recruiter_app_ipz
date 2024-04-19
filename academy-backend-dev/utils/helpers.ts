import config from 'config';
import {OAuth2Client} from 'google-auth-library';
import {Query} from 'express-serve-static-core';
import {QuestionQuery} from 'interfaces/questions/questionQuery';
import {QuestionLimit} from 'constants/question.constants';
import {GetTokenResponse} from 'google-auth-library/build/src/auth/oauth2client';
import {Question} from 'interfaces';
import {Document, UpdateQuery} from 'mongoose';

const origin = config.get<string>('server.origin');
const CLIENT_ID = config.get<string>('google.clientId');
const CLIENT_SECRET = config.get<string>('google.clientSecret');

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, origin);

export async function getUserFromToken(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Invalid token');
  }

  console.log(payload);

  return {
    firstName: payload.given_name,
    lastName: payload.family_name,
    email: payload.email
  };
}

export async function convertRequestQueryToGetQuestions(reqQuery: Query) {
  const query: QuestionQuery = {
    filters: {},
    sorting: {},
    page: reqQuery.page ? parseInt(reqQuery.page as string) : 0,
    limit: reqQuery.limit ? parseInt(reqQuery.limit as string) : QuestionLimit
  };

  if (reqQuery.title) {
    query.filters['title'] = {$regex: new RegExp(String(reqQuery.title), 'i')};
  }

  if (reqQuery.topics) {
    query.filters['topics'] = {$all: reqQuery.topics};
  }

  if (reqQuery.type) {
    query.filters['type'] = reqQuery.type;
  }

  query.sorting['field'] = reqQuery.field ? reqQuery.field : 'title';

  query.sorting['order'] = reqQuery.order ? reqQuery.order : 'asc';

  return query;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getTokensFromCode(code: string): Promise<GetTokenResponse['tokens']> {
  const response = await client.getToken(code);
  return response.tokens;
}

export function calculateApplicationScore(questions: UpdateQuery<Document & Question>): number {
  const maxScore = questions.length * 10;
  const currentScore = questions.reduce((accum, value) => accum + value.answer.mark, 0);
  const candidateScore = (currentScore / maxScore) * 100;
  return +candidateScore;
}
