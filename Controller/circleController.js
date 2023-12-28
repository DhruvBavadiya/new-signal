const catcherror = require("../Middleware/catcherror");
const ErrorHandler = require("../Utils/errorHandler");
const Circle = require("../Model/circleSchema");
const TrafficSignal = require("../Model/trafficSignalSchema");
// const { calculateDistance, getElapsedTime, getTrafficLightStatus } = require("./SignalLightController");


function getElapsedTime(signal) {
  const currentTime = new Date().getTime();
  const lastUpdateTime = new Date(signal.updatedAt).getTime();
  const elapsedTime = (currentTime - lastUpdateTime) / 1000;
  return Math.floor(elapsedTime);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // Distance in kilometers
}


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


exports.getAllCircle = catcherror(async (req,res,next)=>{
  const circle = await Circle.find();

  if(circle){
    res.status(200).json({
      success: true,
      circle,
    });
  } else {
    return next(new ErrorHandler("No circle found.", 401));
  }
})

exports.DeleteCircle = catcherror(async(req,res,next)=>{
  const {circleId} = req.body
  const circle = await Circle.deleteOne({circleId:circleId})

  if(!circle){
    return next(new ErrorHandler("No circle found.", 401));
  }

  res.status(200).json({
    success:true
  })

})

exports.getCircleByCoordinates = async(req,res)=>{
  const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const distanceInRadians = maxDistance / 6371;

  const circles = await Circle.find({
    coordinates: {
      $geoWithin: {
        $centerSphere: [[latitude, longitude], distanceInRadians], // Convert distance to radians
      },
    },
  });

  circles.forEach((circle) => {
    const distance = calculateDistance(
      lat,
      lon,
      circle.coordinates.latitude,
      circle.coordinates.longitude
    );
    circle.distance = distance; 
  });

  // Sort signals by distance (ascending order)
  circles.sort((a, b) => a.distance - b.distance);
  const circleCount = circles.length;

  res.json({ success: true, circleCount, circles });
}

