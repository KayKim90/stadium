const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.courseId) filter = { course: req.params.courseId };

//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: "success",
//     results: reviews.length,
//     data: {
//       reviews
//     }
//   });
// });

exports.setCourseUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
