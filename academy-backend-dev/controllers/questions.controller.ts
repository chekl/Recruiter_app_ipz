import {NextFunction, Request, Response} from 'express';
import {EditQuestionPayload, Question} from 'interfaces';
import {questionsService} from 'services';

/**
 * @apiDefine QuestionsBase
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
 * @api {get} /questions Get all questions
 * @apiName ListQuestions
 * @apiDescription This route allows to list all questions.
 * @apiGroup Questions
 *
 * @apiSampleRequest /questions/
 *
 * @apiQuery {String{2..}} [title] Optional. Filter questions by title.
 * @apiQuery {String[]} [topics] Optional. Filter questions by topics (Array of topic ID).
 * @apiQuery {String} [type] Optional. Filter questions by type ID.
 * @apiQuery {String} [field=title] Optional. Sort questions by field in the specified order.
 * @apiQuery {String} [order=asc] Optional. Sort questions by field in the specified order.
 * @apiQuery {String} page=0 Required. Page number for pagination.
 * @apiQuery {String} [limit=7] Optional. Number of items per page for pagination.
 *
 * @apiSuccess {Object} result Result object containing the questions array and amount.
 * @apiSuccess {Number} result.amount Total number of questions.
 * @apiSuccess {Array} result.data Array of questions.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "amount": 10,
 *       "data": [
 *         {
 *           "_id": "619a5d1dfb010b0ac0310f7b",
 *           "title": "New Question",
 *           "description": "Description for question",
 *           "time": 20,
 *           "topics": [
 *                 {
 *                     "_id": "65a976f7c04c7606643f0401",
 *                     "name": "nodejs"
 *                 },
 *                 {
 *                     "_id": "65a976ffc04c7606643f0402",
 *                     "name": "front-end"
 *                 }
 *             ],
 *          "type": {
 *                 "_id": "65a974b4c04c7606643f03fb",
 *                 "name": "text",
 *                 "link": "images/text"
 *             },
 *          "vacancies": ["65b275a05a200feb5d9ffbff"]
 *         },
 *         ...
 *       ]
 *     }
 *
 * @apiUse QuestionsBase
 */
async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const [questions, amount] = await questionsService.getList(req.query);
    res.json({
      amount,
      data: questions
    });
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} /questions/:id Get one question
 * @apiName GetOneQuestion
 * @apiDescription This route allows to get question by id.
 * @apiGroup Questions
 *
 * @apiSampleRequest /questions/:id
 *
 * @apiParam {ObjectId} id    Question id.
 * @apiParamExample {string} Request Url Example:
 *     /api/questions/507f1f77bcf86cd799439011
 *
 * @apiSuccess {Object} questions Question fetched by id.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
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
            "vacancies": ["65b275a05a200feb5d9ffbff"]
        }

 * @apiError QuestionsNotFound [400] Question not found.
 *
 * @apiUse QuestionsBase
 */
async function getOne(req: Request<{id: string}>, res: Response, next: NextFunction) {
  const {id} = req.params;
  try {
    const question = await questionsService.getOne(id);

    res.json(question);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /questions Create a new question
 * @apiName CreateQuestion
 * @apiDescription This route allows to create a new question.
 * @apiGroup Questions
 *
 * @apiBody {String} title        Question title.
 * @apiBody {String} description  Question description.
 * @apiBody {Number} time         Time for question execution.
 * @apiBody {ObjectId[]} topics   Question topics.
 * @apiBody {ObjectId} type       Question type.
 *
 * @apiSuccess {ObjectId} _id         Question id.
 * @apiSuccess {String} title         Question title.
 * @apiSuccess {String} description   Question description.
 * @apiSuccess {Number} time          Time for question execution.
 * @apiSuccess {ObjectId[]} topics    Question topics.
 * @apiSuccess {ObjectId} type        Question type.
 * @apiSuccess {ObjectId[]} vacancies List of vacancies in which question present.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
        {
            "title": "title",
            "topics": [
                {
                    "_id": "65a97659c04c7606643f03ff",
                    "name": "angular"
                },
                {
                    "_id": "65a976ebc04c7606643f0400",
                    "name": "react"
                }
            ],
            "description": "desc",
            "time": 23,
            "type": {
                "_id": "65a974b4c04c7606643f03fb",
                "name": "text",
                "link": "images/text"
            },
            "vacancies": [],
            "_id": "65b32be55c59f900e2963aa4"
        }
 *
 * @apiUse QuestionsBase
 */
async function createQuestion(
  req: Request<unknown, unknown, Question>,
  res: Response,
  next: NextFunction
) {
  try {
    const question = await questionsService.createQuestion(req.body);

    res.status(201).json(question);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {patch} /questions/:id Update questions
 * @apiName UpdateQuestions
 * @apiDescription This route allows to update question by id.
 * @apiGroup Questions
 *
 * @apiSampleRequest /questions/:id
 *
 * @apiParam {ObjectId} id    Question id.
 * @apiParamExample {string} Request Url Example:
 *     /api/questions/507f1f77bcf86cd799439011
 * 
 * @apiBody {String} [title]        Question title.
 * @apiBody {String} [description]  Question description.
 * @apiBody {Number} [time]         Time for question execution.
 * @apiBody {ObjectId[]} [topics]   Question topics.
 * @apiBody {ObjectId} [type]       Question type.
 *
 * @apiSuccess {Object} questions Updated Question.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
        {
            "_id": "65b32be55c59f900e2963aa4",
            "title": "Edited title",
            "topics": [
                {
                    "_id": "65a97659c04c7606643f03ff",
                    "name": "angular"
                },
                {
                    "_id": "65a976ebc04c7606643f0400",
                    "name": "react"
                }
            ],
            "description": "desc",
            "time": 23,
            "type": {
                "_id": "65a974b4c04c7606643f03fb",
                "name": "text",
                "link": "images/text"
            },
            "vacancies": []
        }
 * 
 * @apiError QuestionsNotFound [400] Question not found.
 *
 * @apiUse QuestionsBase
 */
async function updateQuestion(
  req: Request<{id: string}, unknown, EditQuestionPayload>,
  res: Response,
  next: NextFunction
) {
  const {id} = req.params;
  try {
    const updateResult = await questionsService.updateQuestion(id, req.body);

    res.json(updateResult);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {delete} /questions/:id Delete question
 * @apiName DeleteQuestions
 * @apiDescription This route allows to delete question by id.
 * @apiGroup Questions
 *
 * @apiSampleRequest /questions/:id
 *
 * @apiParam {ObjectId} id Question id.
 * @apiParamExample {string} Request Url Example:
 *     /api/questions/507f1f77bcf86cd799439011
 *
 * @apiSuccess {Object} questions Question delete result.
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
        {
            "acknowledged": true,
            "deletedCount": 1
        }
 * 
 * @apiError QuestionsNotFound [400] Question not found.
 *
 * @apiUse QuestionsBase
 */
async function deleteQuestion(req: Request<{id: string}>, res: Response, next: NextFunction) {
  const {id} = req.params;
  try {
    const deleteResult = await questionsService.deleteQuestion(id);

    res.json(deleteResult);
  } catch (e) {
    next(e);
  }
}

export {getList, getOne, createQuestion, updateQuestion, deleteQuestion};
