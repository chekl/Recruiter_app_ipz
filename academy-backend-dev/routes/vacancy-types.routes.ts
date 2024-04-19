import express from 'express';

import {VacancyTypesController} from '../controllers';

const router = express.Router();

router.route('/').get(VacancyTypesController.getList);

export default router;
