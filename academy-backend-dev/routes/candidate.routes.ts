import express from 'express';
import {CandidateController} from 'controllers';

const router = express.Router();

router.route('/:email').get(CandidateController.getCandidateByEmail);

router.route('').post(CandidateController.createCandidate);

export default router;
