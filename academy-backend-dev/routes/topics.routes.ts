import express from 'express';

import {TopicsController} from '../controllers';
import * as middleware from '../middlewares';

const router = express.Router();

router.route('/').get(TopicsController.getList);

export default router;
