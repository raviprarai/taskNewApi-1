import express from "express";
import auth from "./auth"
import session from "./session.routes"
import teacher from "./teacher.routes"
const router = express.Router();

router.use("/users", auth);
router.use("/sessions",session)
router.use("/teachers",teacher)
export default router;
