import express from 'express';
import {AuthController} from '../controllers';

const router = express.Router();

router.route('/signin').post(AuthController.findOrCreateUser);

router.route('/refreshtoken').post(AuthController.getNewTokens);

router.route('/logout').post(AuthController.logout);

export default router;
