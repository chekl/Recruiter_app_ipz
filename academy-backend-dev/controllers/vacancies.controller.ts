import {NextFunction, Request, Response} from 'express';
import {EditVacancyPayload, Vacancy} from 'interfaces';
import {vacanciesService} from 'services';

/**
 * @apiDefine VacanciesBase
 *
 * @apiPermission Admin
 *
 * @apiHeader {String} Cookie Cookie`s with access_token and refresh_token.
 * @apiHeaderExample {json} Cookie example:
 *     {
 *       "Cookie": "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;"
 * }
 * @apiError UserNotAuthorized [401] Invalid user's token.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "User's token is invalid",
 *       "status": "user.invalid_token",
 *       "http_code": 401
 *     }
 */
/**
 * @api {get} /vacancies Get all vacancies
 * @apiName ListVacancies
 * @apiDescription This route allows to list all vacancies.
 * @apiGroup Vacancies
 *
 * @apiSampleRequest /vacancies/
 *
 * @apiQuery {String} [status=asc] Optional. Sort vacancies by status in the specified order.
 * @apiQuery {String} [page=0] Optional. Page number for pagination.
 * @apiQuery {String} [opened=asc] Optional. Sort vacancies by opened date in the specified order.
 * 
 * @apiSuccess {Array} vacancies Vacancies array.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
    "amount": 2,
    "data": [
        {
            "_id": "65b376d5a5498f1769f1dce8",
            "title": "New Vacancy",
            "description": "some description",
            "link": "https://angular.io/guide/form-validation",
            "status": "Active",
            "type": {
                "_id": "65aa516ac8167be234469ca4",
                "name": "Management"
            },
            "applications": [
                "5f7b8e348b3f9a4a901e7b32"
            ],
            "questions": [
                "65b27ddac78d848418a2771a",
                "65b27ddac5abab8a8f0d9bcf"
            ],
            "opened": "2024-01-26T09:09:41.884Z",
            "createdAt": "2024-01-26T09:09:41.892Z",
            "updatedAt": "2024-01-26T09:09:41.892Z"
        },
        {
            "_id": "65b2d12599e3630489a50365",
            "title": "Vacancy Title",
            "description": "Vacancy Description",
            "link": "https://example.com",
            "status": "Active",
            "type": {
                "_id": "65aa50f7c8167be234469ca3",
                "name": "Web"
            },
            "applications": [
                "5f7b8e348b3f9a4a901e7b31"
            ],
            "questions": [
                "65b27ddac78d848418a2771a",
                "65b27dda88b3673d94d4d8c0"
            ],
            "opened": "2024-01-25T21:22:45.789Z",
            "createdAt": "2024-01-25T21:22:45.792Z",
            "updatedAt": "2024-01-25T21:22:45.792Z"
        }
    ]
}
 *
 * @apiUse VacanciesBase
 */
async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const [amount, vacancies] = await vacanciesService.getList(req.query);

    res.json({
      amount,
      data: vacancies
    });
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} /vacancies/:id Get one vacancy
 * @apiName GetOneVacancy
 * @apiDescription This route allows to get vacancy by id.
 * @apiGroup Vacancies
 *
 * @apiSampleRequest /vacancies/:id
 *
 * @apiParam {ObjectId} id    Vacancy id.
 * @apiParamExample {string} Request Url Example:
 *     /api/vacancies/507f1f77bcf86cd799439011
 * 
 * @apiSuccess {Object} vacancies Vacancy fetched by id.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *      {
          "_id": "65ad0b13e9925286e736469f",
          "title": "Brand new",
          "description": "descr",
          "status": "Active",
          "type": {
              "_id": "65a97b9bc04c7606643f0424",
              "name": "Web"
          },
          "questions": [
              {
                  "_id": "65a97770c04c7606643f0405",
                  "title": "New Question",
                  "description": "Description for question",
                  "time": 20,
                  "topics": [
                      {
                          "_id": "65a97659c04c7606643f03ff",
                          "name": "angular"
                      },
                      {
                          "_id": "65a976ffc04c7606643f0402",
                          "name": "front-end"
                      }
                  ],
                  "type": {
                      "_id": "65a9761cc04c7606643f03fd",
                      "name": "code",
                      "link": "images/code"
                  }
              },
              {
                  "_id": "65a977b7c04c7606643f0406",
                  "title": "Second Title",
                  "description": "Description description description",
                  "time": 30,
                  "topics": [
                      {
                          "_id": "65a976f7c04c7606643f0401",
                          "name": "nodejs"
                      },
                      {
                          "_id": "65a976ffc04c7606643f0402",
                          "name": "front-end"
                      }
                  ],
                  "type": {
                      "_id": "65a974b4c04c7606643f03fb",
                      "name": "text",
                      "link": "images/text"
                  }
              }
          ],
          "opened": "2024-01-21T12:16:19.044Z",
          "createdAt": "2024-01-21T12:16:19.045Z",
          "updatedAt": "2024-01-21T12:16:19.045Z",
          "executionTime": 50
 *      }
 *
 * @apiError VacanciesNotFound [400] Vacancy not found.
 *
 * @apiUse VacanciesBase
 */
async function getOne(req: Request<{id: string}>, res: Response, next: NextFunction) {
  const {id} = req.params;
  try {
    const vacancy = await vacanciesService.getOne(id);

    res.json(vacancy);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /vacancies Create a new vacancy
 * @apiName CreateVacancy
 * @apiDescription This route allows to create a new vacancy.
 * @apiGroup Vacancies
 * 
 * @apiBody {String} title          Vacancy title.
 * @apiBody {String} [link]         Vacancy link.
 * @apiBody {String} description    Vacancy description.
 * @apiBody {ObjectId} type         Vacancy type.
 * @apiBody {ObjectId[]} questions  Vacancy questions.
 *
 * @apiSuccess {Object} vacancies Created vacancy.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 201 OK
        {
            "title": "New Vacancy",
            "description": "description",
            "status": "Active",
            "type": {
                "_id": "65a97b9bc04c7606643f0424",
                "name": "Web"
            },
            "questions": [
                {
                    "_id": "65a977b7c04c7606643f0406",
                    "title": "BRAND NEW TITLE",
                    "description": "fhgj",
                    "time": 206,
                    "topics": [
                        {
                            "_id": "65a976f7c04c7606643f0401",
                            "name": "nodejs"
                        },
                        {
                            "_id": "65a976ebc04c7606643f0400",
                            "name": "react"
                        },
                        {
                            "_id": "65a97659c04c7606643f03ff",
                            "name": "angular"
                        }
                    ],
                    "type": {
                        "_id": "65a974b4c04c7606643f03fb",
                        "name": "text",
                        "link": "images/text"
                    },
                    "vacancies": [
                        "65b275a05a200feb5d9ffbff",
                        "65b32dc24fb355cb8b1cf37e",
                        "65b32fc5095f2ef0ddfb1337"
                    ]
                },
                {
                    "_id": "65a97770c04c7606643f0405",
                    "title": "dqerqrhk,giylstyrt",
                    "description": "description",
                    "time": 335,
                    "topics": [
                        {
                            "_id": "65a97659c04c7606643f03ff",
                            "name": "angular"
                        },
                        {
                            "_id": "65a976ebc04c7606643f0400",
                            "name": "react"
                        },
                        {
                            "_id": "65a976f7c04c7606643f0401",
                            "name": "nodejs"
                        },
                        {
                            "_id": "65a976ffc04c7606643f0402",
                            "name": "front-end"
                        }
                    ],
                    "type": {
                        "_id": "65a9761cc04c7606643f03fd",
                        "name": "code",
                        "link": "images/code"
                    },
                    "vacancies": [
                        "65b275a05a200feb5d9ffbff",
                        "65b32dc24fb355cb8b1cf37e",
                        "65b32fc5095f2ef0ddfb1337"
                    ]
                }
            ],
            "_id": "65b32fc5095f2ef0ddfb1337",
            "opened": "2024-01-26T04:06:29.882Z",
            "createdAt": "2024-01-26T04:06:29.887Z",
            "updatedAt": "2024-01-26T04:06:29.887Z"
        }
 * @apiUse VacanciesBase
 */
async function createVacancy(
  req: Request<unknown, unknown, Vacancy>,
  res: Response,
  next: NextFunction
) {
  try {
    const vacancy = await vacanciesService.createVacancy(req.body);

    res.json(vacancy);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {patch} /vacancies/:id Update vacancy
 * @apiName UpdateVacancies
 * @apiDescription This route allows to update vacancy by id.
 * @apiGroup Vacancies
 *
 * @apiSampleRequest /vacancies/:id
 *
 * @apiParam {ObjectId} id    Vacancy id.
 * @apiParamExample {string} Request Url Example:
 *     /api/vacancies/507f1f77bcf86cd799439011
 * 
 * @apiBody {String} [title]             Vacancy title.
 * @apiBody {String} [link]              Vacancy link.
 * @apiBody {String} [description]       Vacancy description.
 * @apiBody {String} [status]            Vacancy status.
 * @apiBody {ObjectId} [type]            Vacancy type.
 * @apiBody {ObjectId[]} [applications]  Vacancy description.
 * @apiBody {Date} [opened]              Vacancy open date.
 * 
 * @apiSuccess {Object} vacancies Updated vacancy.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
        {
            "_id": "65b32fc5095f2ef0ddfb1337",
            "title": "Edited title",
            "description": "description",
            "status": "Active",
            "type": {
                "_id": "65a97b9bc04c7606643f0424",
                "name": "Web"
            },
            "questions": [
                {
                    "_id": "65a977b7c04c7606643f0406",
                    "title": "BRAND NEW TITLE",
                    "description": "fhgj",
                    "time": 206,
                    "topics": [
                        {
                            "_id": "65a976f7c04c7606643f0401",
                            "name": "nodejs"
                        },
                        {
                            "_id": "65a976ebc04c7606643f0400",
                            "name": "react"
                        },
                        {
                            "_id": "65a97659c04c7606643f03ff",
                            "name": "angular"
                        }
                    ],
                    "type": {
                        "_id": "65a974b4c04c7606643f03fb",
                        "name": "text",
                        "link": "images/text"
                    },
                    "vacancies": [
                        "65b275a05a200feb5d9ffbff",
                        "65b32dc24fb355cb8b1cf37e",
                        "65b32fc5095f2ef0ddfb1337"
                    ]
                },
                {
                    "_id": "65a97770c04c7606643f0405",
                    "title": "dqerqrhk,giylstyrt",
                    "description": "description",
                    "time": 335,
                    "topics": [
                        {
                            "_id": "65a97659c04c7606643f03ff",
                            "name": "angular"
                        },
                        {
                            "_id": "65a976ebc04c7606643f0400",
                            "name": "react"
                        },
                        {
                            "_id": "65a976f7c04c7606643f0401",
                            "name": "nodejs"
                        },
                        {
                            "_id": "65a976ffc04c7606643f0402",
                            "name": "front-end"
                        }
                    ],
                    "type": {
                        "_id": "65a9761cc04c7606643f03fd",
                        "name": "code",
                        "link": "images/code"
                    },
                    "vacancies": [
                        "65b275a05a200feb5d9ffbff",
                        "65b32dc24fb355cb8b1cf37e",
                        "65b32fc5095f2ef0ddfb1337"
                    ]
                }
            ],
            "opened": "2024-01-26T04:06:29.882Z",
            "createdAt": "2024-01-26T04:06:29.887Z",
            "updatedAt": "2024-01-26T04:08:40.158Z"
        }
 *
 * @apiError VacanciesNotFound [400] Vacancy not found.
 *
 * @apiUse VacanciesBase
 */
async function updateVacancy(
  req: Request<{id: string}, unknown, EditVacancyPayload>,
  res: Response,
  next: NextFunction
) {
  const {id} = req.params;
  try {
    const updateResult = await vacanciesService.updateVacancy(id, req.body);

    res.json(updateResult);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {delete} /vacancies/:id Delete vacancy
 * @apiName DeleteVacancies
 * @apiDescription This route allows to delete vacancy by id.
 * @apiGroup Vacancies
 *
 * @apiSampleRequest /vacancies/:id
 *
 * @apiParam {ObjectId} id Vacancy id.
 * @apiParamExample {string} Request Url Example:
 *     /api/vacancies/507f1f77bcf86cd799439011
 *
 * @apiSuccess {Object} vacancies Delete result.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
        {
            "acknowledged": true,
            "deletedCount": 1
        }
 *
 * 
 * @apiError VacanciesNotFound [400] Vacancy not found.
 *
 * @apiUse VacanciesBase
 */
async function deleteVacancy(req: Request<{id: string}>, res: Response, next: NextFunction) {
  const {id} = req.params;
  try {
    const deleteResult = await vacanciesService.deleteVacancy(id);

    res.json(deleteResult);
  } catch (e) {
    next(e);
  }
}

export {getList, getOne, createVacancy, updateVacancy, deleteVacancy};
