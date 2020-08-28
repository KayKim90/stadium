const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");
// const validator = require("validator");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A course name must have less or equal than 40 characters"
      ],
      minlength: [
        10,
        "A course name must have more or equal than 10 characters"
      ]
      // validate: [validator.isAlpha, "Course name must contain characters"] // How to use validator library
    },
    slug: String,
    category: {
      type: String,
      required: [true, "Must Have a category"]
    },
    difficulty: {
      type: String,
      required: [true, "Must Have a difficulty"],
      enum: {
        values: ["entry", "intermediate", "expert"],
        message: "Difficulty should be one of entry, intermidiate, or expert"
      }
    },
    hours: {
      type: Number,
      required: [true, "Must Have a hours"]
    },
    lectures: {
      type: Number,
      required: [true, "Must Have a lectures"]
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: val => Math.round(val * 10) / 10 // 4.6666(round will be 5), 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "Must have a price"],
      default: 100
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //  this only points to current doc on NEW doument creation
          return val < this.price;
        },
        messege: "Discount price should be less than regular price"
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Must have a summary"]
    },
    description: {
      type: String,
      trim: true
    },
    imgCover: {
      type: String,
      required: [true, "Must have a image cover"]
    },
    imgs: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    promotionDates: [Date],
    secreteCourse: {
      type: Boolean,
      default: false
    },
    teachers: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// courseSchema.index({ price: 1 });
courseSchema.index({ slug: 1 });

courseSchema.virtual("hoursToDays").get(function() {
  return this.hours / 24;
});

// Virtual populate
courseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "course",
  localField: "_id"
});

// 1) Document middleware: runs before .save() and .create() - not UPDATE
courseSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// courseSchema.pre("save", async function(next) {
//   const teachersPromises = this.teachers.map(
//     async id => await User.findById(id)
//   );
//   this.teachers = await Promise.all(teachersPromises);
//   next();
// });

// courseSchema.pre("save", function(next) {
//   console.log("will save document...");
//   next();
// });

// courseSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

// 2) Query Middleware
courseSchema.pre(/^find/, function(next) {
  // courseSchema.pre("find", function(next) {
  this.find({ secreteCourse: { $ne: true } });
  next();
});

courseSchema.pre(/^find/, function(next) {
  this.populate({
    path: "teachers",
    select: "-__v -passwordChangedAt"
  });
  next();
});

courseSchema.post(/^find/, function(docs, next) {
  console.log(docs);
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
