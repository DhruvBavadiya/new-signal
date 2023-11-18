const catcherror = require("../Middleware/catcherror");
const ErrorHandler = require("../Utils/errorHandler");
const Circle = require("../Model/circleSchema");
const TrafficSignal = require("../Model/trafficSignalSchema");

exports.addCircle = catcherror(async (req, res, next) => {
  const data = req.body;

  const circle = new Circle(data);

  const circleId = req.body.circleId;
  // Save the circle with the updated signalIds
  try {
    const savedCircle = await circle.save();
    res.status(201).json(savedCircle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getCircle = catcherror(async (req, res, next) => {
  const { circleId } = req.body;
  const circle = await Circle.findOne({ circleId: circleId });

  if (circle) {
    res.status(200).json({
      success: true,
      circle,
    });
  } else {
    return next(new ErrorHandler("No circle for this id.", 401));
  }
});
