const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllJobs,
  getJobsAppliedByLoginId,
  removeJobApplication,
  getJobList,
  createJob,
} = require("../controllers/job.controller");

router.route("/all-jobs").get(verifyToken, getAllJobs);

router
  .route("/jobs-applied/:loginId")
  .get(verifyToken, getJobsAppliedByLoginId);

router.delete(
  "/jobs-applied/:loginId/:jobId",
  verifyToken,
  removeJobApplication
);

router.get("/job-list",  getJobList);

router.post("/post-job", createJob);


module.exports = router;
