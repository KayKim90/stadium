const express = require("express");
const viewController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get(
  "/course/:slug",
  authController.isLoggedIn,
  viewController.getCourse
);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewController.createUser);
router.get("/me", authController.protect, viewController.getMyPage);

module.exports = router;
