const Course = require("../models/courseModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get course data from collection
  const courses = await Course.find();

  // 2) Build template

  // 3) Render that template using course data from setp 1
  res.status(200).render("overview", {
    title: "All courses",
    courses
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  });

  if (!course) {
    return next(new AppError("There is no course with that name.", 404));
  }

  res.status(200).render("course", {
    title: course.name,
    course
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log In"
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign up"
  });
});

exports.getMyPage = async (req, res) => {
  res.status(200).render("account", {
    title: "My page"
  });
};
