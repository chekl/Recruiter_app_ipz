import {Request, Response, NextFunction} from 'express';

import vacancyTypesService from 'services/vacancy-types/vacancy-types.service';
import {catchError} from 'middlewares/catch-error.middleware';
import {VacancyType} from 'interfaces';

/**
 * @api {get} /vacancy-types Get List of Vacancy Types
 * @apiName GetVacancyTypes
 * @apiGroup VacancyTypes
 *
 * @apiDescription Retrieve a list of vacancy types. This endpoint returns all available vacancy types.
 *
 * @apiSuccess {Number} amount The number of vacancy types returned.
 * @apiSuccess {Array} data An array of vacancy types.
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "amount": 2,
 *       "data": [
 *         {
 *           "_id": {"$oid": "65a6cc5c12588c1f49a3029f"},
 *           "name": "Web",
 *         },
 *         {
 *           "_id": {"$oid": "65a6cc5c12588c1f49a3021f"},
 *           "name": "Management",
 *         },
 *       ]
 *     }
 */

const getList = catchError(async function (req: Request, res: Response, next: NextFunction) {
  const types: VacancyType[] = await vacancyTypesService.getList();
  res.json({
    amount: types.length,
    data: types
  });
});

export {getList};
