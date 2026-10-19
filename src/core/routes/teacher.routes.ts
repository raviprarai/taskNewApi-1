import * as teacher from '../controllers/teacher.controller';
import { Router } from 'express';
import { validate } from "../../middlewares/validate.middleware";
import {
  createTeacherSchema
} from "../../validation/teacher.validation";
import { verifyUserToken, verifyUserTokens } from '../../middlewares/authentication';

const router = Router();


router.route("/createTeacher").post(validate(createTeacherSchema), teacher.createTeacher);


export default router;