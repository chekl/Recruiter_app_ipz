import {NextFunction, Request, Response} from 'express';
import candidateService from 'services/candidate/candidate.service';

/**
 * @apiDefine CandidatesBase Candidates
 * Common parameters and success responses for Candidates.
 */

/**
 * @api {get} /candidates/:email Get Candidate By Email
 * @apiName GetCandidateByEmail
 * @apiGroup Candidates
 *
 * @apiDescription Retrieve a candidate based on a specific email filter.
 *
 * @apiParam {String} email Candidate's email address for searching.
 *
 * @apiSuccess {Object} candidate with specified email.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *      {
 *        "_id": "65aed842520b97c029dd27b1",
 "email": "johndoe@gmail.com",
 "firstName": "John",
 "lastName": "Doe"
 *      }
 *
 * @apiUse CandidatesBase
 */

async function getCandidateByEmail(
  req: Request<{email: string}>,
  res: Response,
  next: NextFunction
) {
  const email = req.params.email;
  try {
    const candidate = await candidateService.getCandidateByEmail(email);
    res.json(candidate);
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /candidates Create a new candidate
 * @apiName CreateCandidate
 * @apiDescription Create a new candidate.
 * @apiGroup Candidates
 *
 * @apiBody {String} firstName Candidate's First Name.
 * @apiBody {String} lastName Candidate's Last Name.
 * @apiBody {String} email Candidate's Email.
 *
 * @apiSuccess {Object} candidate Created candidate.
 * @apiSuccessExample Success Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "_id": "65ad0b13e9925286e736469f",
 *     "firstName": "John",
 *     "lastName": "Don",
 *     "email": "johndon@gmail.com"
 *   }
 * @apiUse CandidatesBase
 */

async function createCandidate(req, res, next) {
  try {
    const candidate = await candidateService.createCandidate(req.body);
    res.status(201).json(candidate);
  } catch (e) {
    next(e);
  }
}

export {getCandidateByEmail, createCandidate};
