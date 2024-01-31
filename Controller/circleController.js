const catcherror = require("../Middleware/catcherror");
const ErrorHandler = require("../Utils/errorHandler");
const Circle = require("../Model/circleSchema");
const TrafficSignal = require("../Model/trafficSignalSchema");
// const { calculateDistance, getElapsedTime, getTrafficLightStatus } = require("./SignalLightController");

const geolib = require('geolib');

function getElapsedTime(signal) {
  const currentTime = new Date().getTime();
  const lastUpdateTime = new Date(signal.updatedAt).getTime();
  const elapsedTime = (currentTime - lastUpdateTime) / 1000;
  return Math.floor(elapsedTime);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
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
  return distance; // Distance in meters
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

// exports.getCircleByCoordinates = async (req, res) => {
//   const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers

//   const latitude = parseFloat(lat);
//   const longitude = parseFloat(lon);
  
//   // Convert maximum distance from kilometers to meters
//   const maxDistanceInMeters = maxDistance * 1000;

//   // Calculate distance in radians using maximum distance in meters
//   const distanceInRadians = maxDistanceInMeters / 6371000; // 6371000 is the Earth's radius in meters
//   console.log(distanceInRadians, " ", maxDistanceInMeters);

//   const circles = await Circle.find({
//     coordinates: {
//       $geoWithin: {
//         $centerSphere: [[latitude, longitude], distanceInRadians], // Convert distance to radians
//       },
//     },
//   });

//   circles.forEach((circle) => {
//     const distance = calculateDistance(
//       lat,
//       lon,
//       circle.coordinates.latitude,
//       circle.coordinates.longitude
//     );
//     circle.distance = distance;
//   });

//   // Sort signals by distance (ascending order)
//   circles.sort((a, b) => a.distance - b.distance);
//   const circleCount = circles.length;

//   // Log sorted distances
//   const sortedDistances = circles.map((circle) => circle.distance);
//   console.log("Sorted Distances:", sortedDistances);

//   console.log(circleCount);
//   res.json({ success: true, circleCount, circles });
// };



exports.getCircleByCoordinates = async (req, res) => {
  const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  // Convert maximum distance from kilometers to meters
  const maxDistanceInMeters = maxDistance * 1000;

  // Define the coordinates of the center point
  const centerPoint = { latitude, longitude };

  // Fetch all circles from the database
  const allCircles = await Circle.find();

  // Filter circles within the specified radius
  const circlesWithinRadius = allCircles.filter(circle => {
    const circlePoint = { latitude: circle.coordinates.latitude, longitude: circle.coordinates.longitude };
    const distance = geolib.getDistance(centerPoint, circlePoint); // Distance in meters
    return distance <= maxDistanceInMeters;
  });

  // Sort circles by distance (ascending order)
  circlesWithinRadius.sort((a, b) => {
    const aPoint = { latitude: a.coordinates.latitude, longitude: a.coordinates.longitude };
    const bPoint = { latitude: b.coordinates.latitude, longitude: b.coordinates.longitude };
    const distanceA = geolib.getDistance(centerPoint, aPoint); // Distance in meters
    const distanceB = geolib.getDistance(centerPoint, bPoint); // Distance in meters
    return distanceA - distanceB;
  });

  // Log sorted distances
  const sortedDistances = circlesWithinRadius.map(circle => {
    const circlePoint = { latitude: circle.coordinates.latitude, longitude: circle.coordinates.longitude };
    return geolib.getDistance(centerPoint, circlePoint); // Distance in meters
  });
  console.log("Sorted Distances:", sortedDistances);

  const circleCount = circlesWithinRadius.length;

  res.json({ success: true, circleCount, circles: circlesWithinRadius });
};
