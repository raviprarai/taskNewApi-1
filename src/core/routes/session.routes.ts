import * as session from '../controllers/session.controller';
import { Router } from 'express';
import { validate } from "../../middlewares/validate.middleware";
import {
  createSessionSchema
} from "../../validation/session.validation";
import { verifyUserToken, verifyUserTokens } from '../../middlewares/authentication';

const router = Router();


router.route("/createSession").post(validate(createSessionSchema),verifyUserToken, session.createSession);
router.route("/getAvailableSessions").get(verifyUserToken, session.getAvailableSessions);
router.route("/bookSession/:id").post(verifyUserToken, session.bookSession);
router.route("/completeSession/:id").patch(verifyUserToken, session.completeSession);


export default router;