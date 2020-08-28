const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authContorlloer = require("./../controllers/authController");
const router = express.Router({ mergeParams: true });

router.use(authContorlloer.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authContorlloer.restrictTo("user"),
    reviewController.setCourseUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authContorlloer.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    authContorlloer.restrictTo("user", "admin"),
    reviewController.updateReview
  );

module.exports = router;
