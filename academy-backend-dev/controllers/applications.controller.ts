import {NextFunction, Request, Response} from 'express';
import {Application, EditApplicationPayload} from 'interfaces';
import {applicationsService} from 'services';

/**
 * @apiDefine ApplicationsBase Applications
 * Common parameters and success responses for Applications.
 */

/**
 * @api {get} /applications Get all applications
 * @apiName ListApplications
 * @apiDescription Get a list of all applications.
 * @apiGroup Applications
 * @apiSampleRequest /applications/
 * @apiSuccess {Array} applications Array of applications.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "_id": "65ad0b13e9925286e736469f",
 *       "vacancy": "65a97b9bc04c7606643f0424",
 *       "reviewer": {
 *          "_id": "65b0cb95c82c1508c108e369",
 *          "firstName": "Name",
 *          "lastName": "Lastname",
 *          "email": "example@gmail.com",
 *       },
 *       "candidate": {
 *          "_id": "65b0cb95c82c1508c108e369",
 *          "firstName": "Name",
 *          "lastName": "Lastname",
 *          "email": "example@gmail.com",
 *       },
 *       "status": "Invited",
 *       "invited": "2024-01-30T14:23:27.259Z",
 *       "completed": "2024-01-21T12:16:19.045Z",
 *       "creator": "65a97b9bc04c7606643f0425",
 *       "score": "10",
 *        "questions": [
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
                  },
                  "answer": {
                        "status": "Status",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
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
                  },
                  "answer": {
                        "status": "Status",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
                  }
              }
          ],
 *       "executionTime": "72",
         "createdAt": "2024-01-21T12:16:19.045Z",
         "updatedAt": "2024-01-21T12:16:19.045Z"
 *     },
 *     ...
 *   ]
 * @apiUse ApplicationsBase
 */
async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const applications = await applicationsService.getList(req.query);

    res.json(applications);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} /applications/need-review/:userId Get applications that need review by reviewer id
 * @apiName ListApplications
 * @apiDescription Get a list of applications that need review.
 * @apiGroup Applications
 * @apiSampleRequest /applications/need-review/:userId
 * @apiQuery {String} [completed=asc] Optional. Order of sorted by completed date applications
 * @apiParam {ObjectId} userId  Reviewer id.
 * @apiSuccess {Array} applications Array of applications.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 200 OK
      [
          {
              "_id": "65b90948c3a86b8e0a1a0494",
              "vacancy": {
                  "_id": "65b90927c3a86b8e0a1a048b",
                  "title": "New Vacancy",
                  "description": "Vacancy Description",
                  "status": "Active",
                  "type": {
                      "_id": "65a97b9bc04c7606643f0424",
                      "name": "Web"
                  },
                  "questions": [
                      "65a97770c04c7606643f0405"
                  ],
                  "opened": "2024-01-30T14:35:19.737Z",
                  "createdAt": "2024-01-30T14:35:19.738Z",
                  "updatedAt": "2024-01-30T15:35:41.440Z",
                  "applications": [
                      "65b90948c3a86b8e0a1a0494",
                      "65b9174c4b63cb7e26333dde",
                      "65b9174d4b63cb7e26333de3"
                  ]
              },
              "reviewer": "65b90744c3a86b8e0a1a0487",
              "candidate": {
                  "_id": "65b8b30d54410d8f2be2ca56",
                  "email": "vitaly7pidhorny@gmail.com",
                  "firstName": "Vitalii",
                  "lastName": "Pidhornyi"
              },
              "status": "Completed",
              "invited": "2024-01-30T14:23:27.259Z",
              "creator": "65b90744c3a86b8e0a1a0487",
              "questions": [
                  {
                      "title": "New question",
                      "topics": [
                          "65a97659c04c7606643f03ff",
                          "65a976ffc04c7606643f0402"
                      ],
                      "description": "Question description",
                      "time": 50,
                      "type": "65a9761cc04c7606643f03fd",
                      "vacancies": [],
                      "_id": "65b90948c3a86b8e0a1a0495"
                      "answer": {
                        "status": "Answered",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
                      }
                  }
              ],
              "executionTime": 50,
              "createdAt": "2024-01-30T14:35:52.540Z",
              "updatedAt": "2024-01-30T14:35:52.540Z",
              "completed": "2024-01-31T14:35:52.540Z"
          },
          ...
      ]
 * @apiUse ApplicationsBase
 */

async function getNeedReview(req: Request<{userId: string}>, res: Response, next: NextFunction) {
  const {userId} = req.params;
  try {
    const applicationsNeedReview = await applicationsService.getNeedReview(userId, req.query);

    res.json(applicationsNeedReview);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} /applications/for-admin/:id Get one application for admin role
 * @apiName GetOneApplication
 * @apiDescription Get a single application by ID.
 * @apiGroup Applications
 *
 * @apiSampleRequest /applications/for-admin/:id
 *
 * @apiParam {ObjectId} id Application ID.
 * @apiParamExample {string} Request Url Example:
 *   /api/applications/507f1f77bcf86cd799439011
 *
 * @apiSuccess {Object} application Application fetched by ID.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "_id": "65ad0b13e9925286e736469f",
 *       "vacancy": {
 *          "_id": "65b2d12599e3630489a50365",
 *          "title": "Vacancy Title",
 *          "description": "Vacancy Description",
 *          "link": "https://example.com",
 *          "status": "Active",
 *          "type": {
              "_id": "65a97b9bc04c7606643f0424",
              "name": "Web"
            },
 *          "applications": [
 *             {
 *               "_id": "5f7b8e348b3f9a4a901e7b31"
 *             }
 *          ],
 *          "questions": [
 *             {
 *               "_id": "65b27ddac78d848418a2771a"
 *             },
 *             {
 *               "_id": "65b27dda88b3673d94d4d8c0"
 *             }
 *          ],
 *          "opened": "2024-01-25T21:22:45.789Z",
 *          "createdAt": "2024-01-25T21:22:45.792Z",
 *          "updatedAt": "2024-01-25T21:22:45.792Z"
 *       },
 *       "reviewer": {
            "_id": "65ba3532a203ed1d818adbbf",
            "firstName": "academy",
            "lastName": "test",
            "email": "academy.test@techmagic.co",
            "__v": 0
          },
 *       "candidate": {
            "_id": "65ba3853d28e688cc885b78f",
            "email": "vitaly7pidhorny@gmail.com",
            "firstName": "Vitalii",
            "lastName": "Pidhornyi"
          },
 *       "status": "Invited",
 *       "invited": "2024-01-30T14:23:27.259Z",
 *       "completed": "2024-01-21T12:16:19.045Z",
 *       "creator": "65a97b9bc04c7606643f0425",
 *       "score": "10",
 *       "questions": [
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
                  },
                  "answer": {
                        "status": "Status",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
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
                  },
                  "answer": {
                        "status": "Status",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
                  }
              }
          ],
 *       "executionTime": "72",
         "createdAt": "2024-01-21T12:16:19.045Z",
         "updatedAt": "2024-01-21T12:16:19.045Z",
         "rank": 1
 *     },
 *
 * @apiError ApplicationNotFound [404] Application not found.
 *
 * @apiUse ApplicationsBase
 */
async function getOneForAdmin(req: Request, res: Response, next: NextFunction) {
  const {id} = req.params;
  try {
    res.json(await applicationsService.getOneForAdmin(id));
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} /applications/for-candidate/:id Get one application for candidate role
 * @apiName GetOneApplication
 * @apiDescription Get a single application by ID.
 * @apiGroup Applications
 *
 * @apiSampleRequest /applications/for-candidate/:id
 *
 * @apiParam {ObjectId} id Application ID.
 * @apiParamExample {string} Request Url Example:
 *   /api/applications/507f1f77bcf86cd799439011
 *
 * @apiSuccess {Object} application Application fetched by ID.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 200 OK
 *   {
 *       "_id": "65ad0b13e9925286e736469f",
 *       "vacancy": {
 *          "_id": "65b2d12599e3630489a50365",
 *          "title": "Vacancy Title",
 *          "description": "Vacancy Description",
 *          "link": "https://example.com",
 *          "status": "Active",
 *          "type": {
              "_id": "65a97b9bc04c7606643f0424",
              "name": "Web"
            },
 *          "applications": [
 *             {
 *               "_id": "5f7b8e348b3f9a4a901e7b31"
 *             }
 *          ],
 *          "questions": [
 *             {
 *               "_id": "65b27ddac78d848418a2771a"
 *             },
 *             {
 *               "_id": "65b27dda88b3673d94d4d8c0"
 *             }
 *          ],
 *          "opened": "2024-01-25T21:22:45.789Z",
 *          "createdAt": "2024-01-25T21:22:45.792Z",
 *          "updatedAt": "2024-01-25T21:22:45.792Z"
 *       },
 *       "reviewer": "65a97b9bc04c7606643f0425",
 *       "candidate": "65a97b9bc04c7606643f0425",
 *       "status": "Invited",
 *       "invited": "2024-01-30T14:23:27.259Z",
 *       "completed": "2024-01-21T12:16:19.045Z",
 *       "creator": "65a97b9bc04c7606643f0425",
 *       "score": "10",
 *       "questions": [
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
                  },
                  "answer": {
                        "status": "Status",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
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
                  },
                  "answer": {
                        "status": "Status",
                        "mark": 10,
                        "body": "Answer",
                        "executionTime": 15
                  }
              }
          ],
 *       "executionTime": "72",
         "createdAt": "2024-01-21T12:16:19.045Z",
         "updatedAt": "2024-01-21T12:16:19.045Z"
 *     },
 *
 * @apiError ApplicationNotFound [404] Application not found.
 *
 * @apiUse ApplicationsBase
 */

async function getOneForCandidate(req: Request, res: Response, next: NextFunction) {
  const {id} = req.params;
  try {
    res.json(await applicationsService.getOneForCandidate(id));
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /applications Create a new application
 * @apiName CreateApplication
 * @apiDescription Create a new application.
 * @apiGroup Applications
 *
 * @apiBody {ObjectId} vacancy Vacancy ID.
 * @apiBody {ObjectId} reviewer Reviewer ID.
 * @apiBody {ObjectId} candidate Candidate ID.
 * @apiBody {ObjectId} creator Creator ID.
 * @apiBody {Questions[]} questions Array of questions.
 *
 * @apiSuccess {Object} application Created application.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "_id": "65ad0b13e9925286e736469f",
 *     "vacancy": "65a97b9bc04c7606643f0424",
 *     "reviewer": "65a97b9bc04c7606643f0425",
 *     // ... (other fields)
 *   }
 * @apiUse ApplicationsBase
 */
async function createApplication(
  req: Request<unknown, unknown, Application>,
  res: Response,
  next: NextFunction
) {
  try {
    const application = await applicationsService.createApplication(req.body);

    res.json(application);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {patch} /applications/:id Update application
 * @apiName UpdateApplication
 * @apiDescription Update an application by ID.
 * @apiGroup Applications
 *
 * @apiSampleRequest /applications/:id
 *
 * @apiParam {ObjectId} id Application ID.
 * @apiParamExample {string} Request Url Example:
 *   /api/applications/507f1f77bcf86cd799439011
 *
 * @apiBody {String} [reviewer] Application reviewer.
 * @apiBody {String} [status] Application status.
 * @apiBody {Date} [completed] Date when the application is completed.
 * @apiBody {Number} [score] Application score.
 * @apiBody {Date} [invited] Invited date.
 * @apiBody {Question[]} [questions] Questions array with updated answers.
 *
 * @apiSuccess {Object} updateResult Update result.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "acknowledged": true,
 *     "modifiedCount": 1,
 *     "upsertedId": null,
 *     "upsertedCount": 0,
 *     "matchedCount": 1
 *   }
 *
 * @apiError ApplicationNotFound [404] Application not found.
 *
 * @apiUse ApplicationsBase
 */
async function updateApplication(req: Request<{id: string}>, res: Response, next: NextFunction) {
  try {
    const {id} = req.params;
    const updateResult = await applicationsService.updateApplication(id, req.body);

    res.json(updateResult);
  } catch (e) {
    next(e);
  }
}

async function updateManyApplications(
  req: Request<unknown, unknown, {keys: string[]; data: EditApplicationPayload}>,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedApplications = await applicationsService.updateApplications(req.body);

    console.log(updatedApplications);

    res.json(updatedApplications);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {delete} /applications/:id Delete application
 * @apiName DeleteApplication
 * @apiDescription Delete an application by ID.
 * @apiGroup Applications
 *
 * @apiSampleRequest /applications/:id
 *
 * @apiParam {ObjectId} id Application ID.
 * @apiParamExample {string} Request Url Example:
 *   /api/applications/507f1f77bcf86cd799439011
 *
 * @apiSuccess {Object} deleteResult Delete result.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "acknowledged": true,
 *     "deletedCount": 1
 *   }
 *
 *
 * @apiError ApplicationNotFound [404] Application not found.
 * @apiUse ApplicationsBase
 */
async function deleteApplications(
  req: Request<unknown, unknown, {applications: string[]}>,
  res: Response,
  next: NextFunction
) {
  try {
    const deleteResult = await applicationsService.deleteApplications(req.body.applications);

    res.json(deleteResult);
  } catch (e) {
    next(e);
  }
}

export {
  getList,
  getNeedReview,
  getOneForAdmin,
  getOneForCandidate,
  createApplication,
  updateApplication,
  updateManyApplications,
  deleteApplications
};
