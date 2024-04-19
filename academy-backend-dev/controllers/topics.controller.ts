import {Request, Response, NextFunction} from 'express';

import topicsService from 'services/topics/topics.service';
import {catchError} from 'middlewares/catch-error.middleware';
import {Topic} from 'interfaces';
/**
 * @api {get} /topics Get List of Topics
 * @apiName GetTopics
 * @apiGroup Topics
 *
 * @apiDescription Retrieve a list of topics. This endpoint returns all available topics.
 * @apiHeader {String} Cookie Cookie`s with access_token and refresh_token.
 * @apiHeaderExample {json} Cookie example:
 *     {
 *       "Cookie": "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;"
 * }
 * @apiSuccess {Number} amount The number of topics returned.
 * @apiSuccess {Array} data An array of topics.
 * @apiSuccess {String} createdAt Type creation date.
 * @apiSuccess {String} updatedAt Type last update date.
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "amount": 2,
 *       "data": [
 *         {
 *           "_id":  "65a6cc5c12588c1f49a3029f",
 *           "name": "angular",
 *           "createdAt": "2024-01-16T17:08:28.193Z",
 *           "updatedAt": "2024-01-16T17:08:28.193Z"
 *         },
 *         {
 *           "_id":  "65a6cc5c12588c1f49a3021f",
 *           "name": "express",
 *           "createdAt": "2024-01-16T17:21:22.306Z",
 *           "updatedAt": "2024-01-16T17:21:22.306Z"
 *         },
 *       ]
 *     }
 */

const getList = catchError(async function (req: Request, res: Response, next: NextFunction) {
  const topics: Topic[] = await topicsService.getList();
  res.json({
    amount: topics.length,
    data: topics
  });
});

export {getList};
