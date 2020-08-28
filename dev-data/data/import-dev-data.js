const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./../../models/courseModel");
const Review = require("./../../models/reviewModel");
const User = require("./../../models/userModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected"));

// READ json file
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// Import data into DB
const importData = async () => {
  try {
    await Course.create(courses);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data from DB
const deleteData = async () => {
  try {
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Successfully Deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
