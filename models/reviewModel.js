//review - rating, createdAt, ref to course, ref to user
const mongooose = require("mongoose");
const Course = require("./courseModel");

const reviewSchema = new mongooose.Schema(
  {
    review: {
      type: String,
      required: [true, "Please enter contents"]
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"]
    },
    course: {
      type: mongooose.Schema.ObjectId,
      ref: "Course",
      required: true
    },
    user: {
      type: mongooose.Schema.ObjectId,
      ref: "User",
      require: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "name photo"
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId }
    },
    {
      $group: {
        _id: "$course",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post("save", function() {
  //this points to current review
  this.constructor.calcAverageRatings(this.course);
});

// findByIdAndUpdate
// findbyidAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.re = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // this.re = await this.findOne(); does NOT work here, query has already executed
  await this.re.constructor.calcAverageRatings(this.re.course);
});

const Review = mongooose.model("Review", reviewSchema);

module.exports = Review;
