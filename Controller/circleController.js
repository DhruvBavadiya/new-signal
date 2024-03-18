const catcherror = require("../Middleware/catcherror");
const ErrorHandler = require("../Utils/errorHandler");
const Circle = require("../Model/circleSchema");
const TrafficSignal = require("../Model/trafficSignalSchema");
const geolib = require("geolib");

const NodeCache = require("node-cache");
const cache = new NodeCache();
const cacheDurationInSeconds = 600; // Adjust the cache duration as needed


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

  try {
    const savedCircle = await circle.save();
    
    // Clear all circle-related cache
    clearCircleCache();
    
    res.status(201).json(savedCircle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getCircle = catcherror(async (req, res, next) => {
  const { circleId } = req.body;

  try {
    const cachedCircle = cache.get(circleId);
    if (cachedCircle) {
      return res.status(200).json({
        success: true,
        circle: JSON.parse(cachedCircle),
        message: "Circle fetched from cache",
      });
    }

    const circle = await Circle.findOne({ circleId: circleId });
    if (!circle) {
      return next(new ErrorHandler("No circle for this id.", 401));
    }

    cache.set(circleId, JSON.stringify(circle), cacheDurationInSeconds);

    res.status(200).json({
      success: true,
      circle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

exports.getAllCircle = catcherror(async (req, res, next) => {
  try {
    const cachedCircles = cache.get("allCircles");
    if (cachedCircles) {
      return res.status(200).json({
        success: true,
        circles: JSON.parse(cachedCircles),
        message: "Circles fetched from cache",
      });
    }

    const circles = await Circle.find();
    if (!circles || circles.length === 0) {
      return next(new ErrorHandler("No circles found.", 401));
    }

    cache.set("allCircles", JSON.stringify(circles), cacheDurationInSeconds);

    res.status(200).json({
      success: true,
      circles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

exports.DeleteCircle = catcherror(async (req, res, next) => {
  const { circleId } = req.body;

  try {
    const circle = await Circle.deleteOne({ circleId: circleId });
    if (!circle) {
      return next(new ErrorHandler("No circle found.", 401));
    }

    // Clear all circle-related cache
    clearCircleCache();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

exports.getCircleByCoordinates = catcherror(async (req, res) => {
  const { lat, lon, maxDistance } = req.body;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const maxDistanceInMeters = maxDistance * 1000;

  try {
    const cacheKey = `${lat}_${lon}_${maxDistance}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const centerPoint = { latitude, longitude };
    const boundingBox = geolib.getBoundsOfDistance(centerPoint, maxDistanceInMeters);

    const circlesWithinBoundingBox = await Circle.find({
      'coordinates.latitude': { $gte: boundingBox[0].latitude, $lte: boundingBox[1].latitude },
      'coordinates.longitude': { $gte: boundingBox[0].longitude, $lte: boundingBox[1].longitude }
    });

    const circlesWithinRadius = circlesWithinBoundingBox.filter(circle => {
      const circlePoint = { latitude: circle.coordinates.latitude, longitude: circle.coordinates.longitude };
      const distance = geolib.getDistance(centerPoint, circlePoint);
      return distance <= maxDistanceInMeters;
    });

    cache.set(cacheKey, JSON.stringify({ success: true, circleCount: circlesWithinRadius.length, circles: circlesWithinRadius }), cacheDurationInSeconds);

    res.json({ success: true, circleCount: circlesWithinRadius.length, circles: circlesWithinRadius });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


exports.updateCircle = catcherror(async (req, res, next) => {
  const circleId = req.body.circleId;
  if (!circleId) {
    return next(new ErrorHandler("Circle id is not provided.", 401));
  }

  try {
    const circle = await Circle.findOne({ circleId: circleId });
    if (!circle) {
      return next(new ErrorHandler("No circle for this id.", 401));
    }

    circle.set(req.body);
    const updatedCircle = await circle.save();

    // Clear all circle-related cache
    clearCircleCache();

    res.status(200).json({
      success: true,
      message: "Circle updated successfully",
      data: updatedCircle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

function clearCircleCache() {
  const keys = cache.keys();
  keys.forEach(key => cache.del(key));
}