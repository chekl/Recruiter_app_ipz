import express from 'express';
import {ApplicationController} from '../controllers';

const router = express.Router();

router
  .route('/')
  .get(ApplicationController.getList)
  .patch(ApplicationController.updateManyApplications)
  .post(ApplicationController.createApplication)
  .delete(ApplicationController.deleteApplications);

router.route('/:id').patch(ApplicationController.updateApplication);

router.route('/need-review/:userId').get(ApplicationController.getNeedReview);

router.route('/for-admin/:id').get(ApplicationController.getOneForAdmin);

router.route('/for-candidate/:id').get(ApplicationController.getOneForCandidate);

export default router;
