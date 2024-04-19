import express from 'express';
import * as middleware from '../middlewares';
import {QuestionsController} from 'controllers';
import {checkAndCreateTopics} from 'middlewares/checkAndCreateTopics';

const router = express.Router();

router
  .route('/')
  //.all(middleware.Auth.verifyToken)
  .get(QuestionsController.getList)
  .post(checkAndCreateTopics, QuestionsController.createQuestion);

router
  .route('/:id')
  //.all(middleware.Auth.verifyToken)
  .get(QuestionsController.getOne)
  .patch(checkAndCreateTopics, QuestionsController.updateQuestion)
  .delete(QuestionsController.deleteQuestion);

export default router;
