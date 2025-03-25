import { Router } from "express";
import multer from 'multer'
import { createProject, editAssignment, getAssignment, getAssignmentById, getCompletedProjects, getLeaderboard, getProjectById, getTeacherCreatedProjects, getUncompletedProjects, header, loginUser,logoutUser, postAssignment, registerUser, uploadAndSubmitProject } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getUserProfile,
  updateCompletedAssignment,
  updateUserProfile,
  getCreatedAssignments,
  getCompletedAssignments,
  getUncompletedAssignments,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createChallenge, getAllChallenges, getChallengeById, getStudentChallenges, getTeacherChallenges, submitChallenge } from "../controllers/challenge.controller.js";
import { requireTeacher } from "../middlewares/isTeacher.js";

const router = Router();
const uploadNone=multer()

router.route("/profile").get( isAuthenticated, getUserProfile);
router.route("/update").put( isAuthenticated, updateUserProfile);
// Route to get completed projects
router.route('/projects/completed').get( isAuthenticated,getCompletedProjects );
//route to get created Projects
router.route('/projects/created').get(isAuthenticated,getTeacherCreatedProjects)
// Route to get uncompleted projects
router.route('/projects/uncompleted').get( isAuthenticated, getUncompletedProjects);

// Assignment-related endpoints
router.route("/assignments/created").get( isAuthenticated, getCreatedAssignments);
router.route("/assignments/completed").get( isAuthenticated, getCompletedAssignments);
router.route("/assignments/uncompleted").get( isAuthenticated, getUncompletedAssignments);
router.put("/assignments/update-completed", isAuthenticated, updateCompletedAssignment);


router.route("/register").post(registerUser)
router.route("/header").get(isAuthenticated,header)
router.route("/login").post(loginUser)
router.route("/logout").post(isAuthenticated,logoutUser)
router.route("/assignment").post(uploadNone.none(), postAssignment)
router.route("/assignment").get(getAssignment)
router.route("/assignment/:id").get(getAssignmentById)
router.route("/assignment").put(uploadNone.none(), editAssignment)
// router.route("/upload-file").post( upload.single("file"), uploadFile);
router.route('/teacher/projects').get( isAuthenticated, getTeacherCreatedProjects);
router
  .route('/projects')
  .post(
    isAuthenticated,
    // isTeacher,
    upload.fields([
      { name: 'studentFiles', maxCount: 10 }, // Handle up to 10 student files
      { name: 'teacherFiles', maxCount: 10 }, // Handle up to 10 teacher files
    ]),
    createProject
  );
  router.route("/projects/:id").get( getProjectById);
  router.post(
    "/submit-project/:projectId",
    isAuthenticated,
    upload.single("file"), // Uses the provided upload middleware
    uploadAndSubmitProject
  );


// router.route("/")
// router.route("/")  NOW THE CHALLENGES ROUTES



const requireStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ message: "Only students can perform this action." });
  }
};
router.post("/challenges/:id/submit",isAuthenticated, submitChallenge);

router.route("/challenges/created").get(isAuthenticated, getTeacherChallenges);
router.get("/challenges/student",isAuthenticated, getStudentChallenges);

router.get("/challenges",getAllChallenges );
router.post("/challenges", isAuthenticated,requireTeacher, createChallenge);
router.get("/challenges/:id", getChallengeById);
router.get("/leaderboard",isAuthenticated, getLeaderboard);

export default router;