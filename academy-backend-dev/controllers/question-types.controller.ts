import {Request, Response, NextFunction} from 'express';
import config from 'config';

import {catchError} from 'middlewares/catch-error.middleware';
import questionTypesService from 'services/question-types/question-types.service';
import {QuestionType} from 'interfaces';

const serverHost = config.get<string>('server.host');
const serverPort = config.get<string>('server.port');
/**
 * @api {get} /question-types Get List of Question Types
 * @apiName Get Question Types
 * @apiGroup Question Types
 * @apiPermission Admin
 *
 * @apiHeader {String} Cookie Cookie`s with access_token and refresh_token.
 * @apiHeaderExample {json} Cookie example:
 *     {
 *       "Cookie": "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;"
 * }
 * @apiDescription Retrieve a list of question types.
 * @apiSuccess {ObjectId} _id Type id.
 * @apiSuccess {Number} amount of types.
 * @apiSuccess {Object[]} data List of types.
 * 
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "amount": 2,
 *       "data": [
 *         {
 *           "_id": "65a6cc5c12588c1f49a3029f",
 *           "name": "text",
 *           "link": "/images/text.svg"
 *         },
 *         {
 *           "_id":  "65a6cd3812588c1f49a302a1",
 *           "name": "code",
 *           "link": "/images/code.svg"
 *         },
 *
 *     }
 *

 */

const getList = catchError(async function (req: Request, res: Response, next: NextFunction) {
  const types: QuestionType[] = await questionTypesService.getList();
  res.json({
    amount: types.length,
    data: types
  });
});

export {getList};
