import express from 'express';
import {UsersController} from 'controllers';

const router = express.Router();

router.route('/send-invite').post(UsersController.sendInvite);
router.route('/send-result/:applicationId').post(UsersController.sendResult);
router.route('/send-review').post(UsersController.sendReview);
router.route('/users/reviewers/:email').get(UsersController.getReviewers);

export default router;
