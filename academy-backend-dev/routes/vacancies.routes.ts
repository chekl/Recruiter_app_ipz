import express from 'express';

import {VacanciesController} from '../controllers';
import * as middleware from '../middlewares';

const router = express.Router();

router
  .route('/')
  //.all(middleware.Auth.verifyToken)
  .get(VacanciesController.getList)
  .post(VacanciesController.createVacancy);

router
  .route('/:id')
  //.all(middleware.Auth.verifyToken)
  .get(VacanciesController.getOne)
  .patch(VacanciesController.updateVacancy)
  .delete(VacanciesController.deleteVacancy);

export default router;
