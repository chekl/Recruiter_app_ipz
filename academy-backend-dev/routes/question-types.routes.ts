import express from 'express';

import {QuestionTypesController} from '../controllers';
import * as middleware from '../middlewares';

const router = express.Router();

router.route('/').get(QuestionTypesController.getList);

export default router;
