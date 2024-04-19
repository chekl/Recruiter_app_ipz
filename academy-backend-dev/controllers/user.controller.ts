import {NextFunction, Request, Response} from 'express';
import {Application} from 'interfaces';
import {emailsService} from 'services';
import reviewerService from 'services/reviewers/reviewer.service';
/**
 * @api {post} /send-invite Send Invitation Email to Candidate
 * @apiName SendInvite
 * @apiGroup Email
 *
 * @apiBody {Object} application Application object containing necessary data.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Invitation email sent successfully."
 *     }
 *
 * @apiError {Object} error Error object.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
async function sendInvite(
  req: Request<unknown, unknown, Application>,
  res: Response,
  next: NextFunction
) {
  try {
    await emailsService.sendEmailToCandidate(req.body);
    res.status(200).send({message: 'Invitation email sent successfully.'});
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /send-review Send Review Request Email to Reviewer
 * @apiName SendReview
 * @apiGroup Email
 *
 * @apiBody {Object} application Application object containing necessary data.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Review request email sent successfully."
 *     }
 *
 * @apiError {Object} error Error object.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
async function sendResult(
  req: Request<{applicationId: string}>,
  res: Response,
  next: NextFunction
) {
  try {
    const applicationId = req.params.applicationId;
    await emailsService.sendEmailToReviewer(applicationId);
    res.status(200).send({message: 'Review request email sent successfully.'});
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /send-result Send Recruitment Result Email
 * @apiName SendResult
 * @apiGroup Email
 *
 * @apiBody {Object} application Application object containing necessary data.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Recruitment result email sent successfully."
 *     }
 *
 * @apiError {Object} error Error object.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
async function sendReview(
  req: Request<unknown, unknown, Application>,
  res: Response,
  next: NextFunction
) {
  try {
    await emailsService.sendEmailToRecruiter(req.body);
    res.status(200).send({message: 'Recruitment result email sent successfully.'});
  } catch (e) {
    next(e);
  }
}

/**
 * @api {get} users/reviewers/:email Get Filtered Reviewers List
 * @apiName GetReviewers
 * @apiDescription Retrieve a list of reviewers based on a specific email filter.
 * @apiGroup Reviewers
 *
 * @apiParam {String} email Reviewer's email address for filtering.
 *
 * @apiSuccess {Object[]} reviewers List of filtered reviewers.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    [
 *      {
 *        "_id": "65b7d9471c29f529cda1aa50",
 *        "email": "tomsmith@gmail.com",
 *        "firstName": "Tom",
 *        "lastName": "Smith"
 *      },
 *      {
 *        "_id": "65b7d5251c29f529cda1aa48",
 *         "email": "bobbrown@gmail.com",
 *         "firstName": "Bob",
 *         "lastName": "Brown"
 *      }
 *    ]
 */
async function getReviewers(req: Request<{email: string}>, res: Response, next: NextFunction) {
  const email = req.params.email;
  try {
    const reviewers = await reviewerService.getFilteredReviewers(email);
    res.json(reviewers);
  } catch (e) {
    next(e);
  }
}

export {sendInvite, sendReview, sendResult, getReviewers};
