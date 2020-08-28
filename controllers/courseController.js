const Course = require("./../models/courseModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.aliasTopCourses = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name, price, ratingsAverage, summary, difficulty";
  next();
};

// exports.getAllCourses = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Course.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   // EXECUTE QUERY
//   const courses = await features.query;

//   // const query = Course.find()
//   //   .where("duration")
//   //   .equals(30)
//   //   .where("difficulty")
//   //   .equals("easy");

//   // SEND RESPONSE
//   res.status(200).json({
//     status: "success",
//     results: courses.length,
//     data: {
//       courses
//     }
//   });
// });

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, { path: "reviews" });
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseStats = catchAsync(async (req, res, next) => {
  const stats = await Course.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        // _id: "$difficulty",
        numCourses: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgrating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    // {
    //   $match: { _id: { $ne: "EASY" } }
    // }
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  // const year = req.params.year * 1;
  // const plan = await Course.aggregate([
  //   {
  //     $unwind: "$promotionDates"
  //   },
  //   {
  //     $match: {
  //       promotionDates: {
  //         $gte: new Date(`${year}-01-01`),
  //         $lte: new Date(`${year}-12-31`)
  //       }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: { $month: "$promotionDates" },
  //       numCoursesPromo: { $sum: 1 },
  //       courses: { $push: "$name" }
  //     }
  //   },
  //   {
  //     $sort: { numCoursesPromo: -1 }
  //   },
  //   {
  //     $addFields: { month: "$_id" }
  //   },
  //   {
  //     $project: {
  //       _id: 0
  //     }
  //   }
  // ]);
  res.status(200).json({
    status: "success",
    data: { plan }
  });
});
