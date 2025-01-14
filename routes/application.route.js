import express from 'express';
import { getApplicants, getAppliedJobs, postApplication, updateStatus } from '../controller/application.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/apply/:id").post( isAuthenticated, postApplication);
router.route("/get").get(isAuthenticated,getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated,getApplicants);
router.route("/status/:id/update").put(isAuthenticated,updateStatus);




export default router;

