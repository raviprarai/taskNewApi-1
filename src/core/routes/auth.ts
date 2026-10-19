import * as auth from '../controllers/auth';
import { Router } from 'express';
import { validate } from "../../middlewares/validate.middleware";
import {
  registerUserSchema
} from "../../validation/user";
import { verifyUserToken } from '../../middlewares/authentication';

const router = Router();


router.route("/createAccount").post(validate(registerUserSchema), auth.createAccount);
router.route("/getUserSessions").get(verifyUserToken, auth.getUserSessions);


export default router;