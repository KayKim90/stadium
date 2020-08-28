const express = require("express");
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  aliasTopCourses,
  getCourseStats,
  getMontlyPlan
} = require("./../controllers/courseController");

const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");
const router = express.Router();

router.use("/:courseId/reviews", reviewRouter);

// router.param("id");
router.route("/top-5-cheap").get(aliasTopCourses, getAllCourses);
router.route("/tour-stats").get(getCourseStats);
router
  .route("/montly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    getMontlyPlan
  );

router
  .route("/")
  .get(getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    createCourse
  );

router
  .route("/:id")
  .get(getCourse)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "teacher"),
    deleteCourse
  );

module.exports = router;
