const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return next(new AppError("No document found", 404));
    res.status(200).json({
      status: "success",
      data: {
        doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete({ _id: req.params.id });

    if (!doc)
      return next(new AppError("No document found with ID you entered", 404));

    res.status(204).json({
      status: "success",
      data: null
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No data found with ID you entered", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on course
    let filter = {};
    if (req.params.courseId) filter = { course: req.params.courseId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // EXECUTE QUERY
    // const docs = await features.query.explain();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
