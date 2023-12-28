const catcherror = require("../Middleware/catcherror");
const ErrorHandler = require("../Utils/errorHandler");
const TrafficSignal = require("../Model/trafficSignalSchema");
const Circle = require("../Model/circleSchema");

exports.addSignalLightData = catcherror(async (req, res, next) => {
  try {
    const data = req.body;
    const circleId = data.circleId;

    // Find the circle based on circleId
    const circle = await Circle.findOne({ circleId });

    if (circle) {
      // Calculate default values for other lights based on the provided color
      // Create a new signal light with the calculated values
      const newSignalLight = new TrafficSignal(data);

      // Save the signal light to the database
      const savedSignalLight = await newSignalLight.save();

      // Update the circle's signalIds array by pushing the signalId of the saved signal light
      circle.signalIds.push(savedSignalLight.signalId);
      circle.numberOfSignals += 1;

      // Save the updated circle
      await circle.save();

      res.status(201).json(savedSignalLight);
    } else {
      return next(new ErrorHandler("No circle for this id.", 401));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.updateSignal = async (req, res) => {
  const updates = req.body;

  try {
    // Find the signal by ID
    const signal = await TrafficSignal.findById(req.params.Id);

    // Check if the signal exists
    if (!signal) {
      return res
        .status(404)
        .json({ success: false, message: "Signal not found" });
    }

    // Update the signal aspects based on the provided updates
    Object.assign(signal.aspects, updates);

    await signal.save();

    res.json({ success: true, message: "Signal updated successfully", signal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAll = catcherror(async (req, res, next) => {
  const signals = await TrafficSignal.find();
  const newsignals = signals.filter((signal)=>signal.signalStatus == "working")
  if (newsignals) {
    newsignals.forEach((signal) => {
    const elapsedTime = getElapsedTime(signal);
    const liveTime = getTrafficLightStatus(
      elapsedTime,
      signal.aspects.currentColor,
      signal.aspects.durationInSeconds
    );
    signal.aspects.currentColor = liveTime.color;
    signal.aspects.durationInSeconds = liveTime.duration;
    });

    res.status(200).json({
      success: true,
      newsignals,
    });
  } else {
    next(new ErrorHandler("Can't get Place"));
  }
});


exports.getSignalById = catcherror(async (req, res, next) => {
    const signalId = req.body.signalId;
    const signal = await TrafficSignal.findOne({ signalId });
  if(signal.signalStatus=="notworking"){
    return res.status(201).json({
      success:true,
      message:"signal not working",
      signal
    })
  }
    if (!signal) {
      return next(new ErrorHandler("Signal not found"));
    }

    const elapsedTime = getElapsedTime(signal);

    const liveTime = getTrafficLightStatus(
      elapsedTime,
      signal.aspects.currentColor,
      signal.aspects.durationInSeconds
    );
    signal.aspects.currentColor = liveTime.color;
    signal.aspects.durationInSeconds = liveTime.duration;
    // await signal.save()
    // console.log(liveTime)
    res.status(200).json({
      success: true,
      signal,
    });
});

exports.signalOff = catcherror(async(req,res,next)=>{
  // const signalId = req.Query.signalId
  // console.log(signalId)
  const signal = await TrafficSignal.findOne({signalId:req.params.signalId})
  console.log(signal)
    signal.signalNotWorking.signalOfftime = Date.now();
    signal.signalStatus = "notworking"
    await signal.save();

    res.status(200).json({
      message:"signal is off"
    })

})
exports.signalOn = catcherror(async(req,res,next)=>{

    const signal = await TrafficSignal.findOne({signalId:req.params.signalId})
    signal.signalStatus = "working"
    signal.signalNotWorking.signalOfftime = null
    signal.aspects.currentColor = "red",
    signal.aspects.durationInSeconds = 90
    await signal.save()

    res.status(200).json({
      success:true,
      message:"signal is on",
      signal
    })

})

// process of finding elapsedTime

function getElapsedTime(signal) {
  const currentTime = new Date().getTime();
  const lastUpdateTime = new Date(signal.updatedAt).getTime();
  const elapsedTime = (currentTime - lastUpdateTime) / 1000;
  return Math.floor(elapsedTime);
}

// function getTrafficLightStatus(elapsedTime, initialColor, initialDuration) {
//   // Define the durations for each color
//   const redDuration = 90;
//   const yellowDuration = 5;
//   const greenDuration = 30;

//   // Calculate the total cycle duration
//   const totalCycleDuration = redDuration + greenDuration + yellowDuration;
//   console.log("total cycle duration",totalCycleDuration)
//   // Calculate the current cycle number
//   const currentCycle = Math.floor(elapsedTime / totalCycleDuration);
//   console.log("currentcycle",currentCycle)

//   // Calculate the remaining time within the current cycle
//   const remainingTimeInCycle = elapsedTime % totalCycleDuration;

//   console.log("remaining time",remainingTimeInCycle)
//   // Determine the current color and duration based on the remaining time
//   let currentColor, currentDuration;
//   if (remainingTimeInCycle < initialDuration) {
//     currentColor = initialColor;
//     currentDuration = initialDuration - remainingTimeInCycle;
//   } else if (remainingTimeInCycle < greenDuration + initialDuration) {
//     currentColor = "green";
//     currentDuration = greenDuration - (remainingTimeInCycle - initialDuration);
//   } else if (remainingTimeInCycle < totalCycleDuration) {
//     currentColor = "yellow";
//     currentDuration =
//       yellowDuration - (remainingTimeInCycle - (greenDuration + initialDuration));
//   } else {
//     currentColor = "red";
//     currentDuration =
//       redDuration - (remainingTimeInCycle - (totalCycleDuration));
//   }
//   console.log("currenColor",currentColor)
//   console.log("duration",currentDuration)

//   return {
//     color: currentColor,
//     duration: Math.floor(currentDuration), // Ensure the duration is non-negative
//   };
// }

function getTrafficLightStatus(elapsedTime, initialColor, initialDuration) {
  // Define the durations for each color
  const redDuration = 90;
  const yellowDuration = 5;
  const greenDuration = 30;
  
  let elapTime = elapsedTime;
  let curcolor = initialColor;
  let colorduration = initialDuration;

  while (elapTime >= colorduration) {
    if (curcolor === "green") {
      curcolor = "yellow";
      elapTime -= colorduration;
      colorduration = 5;
    } else if (curcolor === "yellow") {
      curcolor = "red";
      elapTime -= colorduration;
      colorduration = 90;
    } else {
      curcolor = "green";
      elapTime -= colorduration;
      colorduration = 30;
    }
  }

  if (elapTime < colorduration) {
    colorduration -= elapTime; // Corrected subtraction
    return {
      color: curcolor,
      duration: Math.floor(colorduration), // Ensure the duration is non-negative
    };
  }
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

exports.signalByCoordinates = catcherror(async (req, res) => {
  const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const distanceInRadians = maxDistance / 6371;

  // Find signals within the specified distance
  const signals = await TrafficSignal.find({
    location: {
      $geoWithin: {
        $centerSphere: [[latitude, longitude], distanceInRadians], // Convert distance to radians
      },
    },
  });

  // Calculate distances for each signal and sort the signals array based on distances
  signals.forEach((signal) => {
    const distance = calculateDistance(
      lat,
      lon,
      signal.location.latitude,
      signal.location.longitude
    );

    signal.distance = distance; // Add the distance property to the signal object
    const elapsedTime = getElapsedTime(signal);

    const liveTime = getTrafficLightStatus(
      elapsedTime,
      signal.aspects.currentColor,
      signal.aspects.durationInSeconds
    );
    signal.aspects.currentColor = liveTime.color;
    signal.aspects.durationInSeconds = liveTime.duration;
  });

  // Sort signals by distance (ascending order)
  signals.sort((a, b) => a.distance - b.distance);
  const signalCount = signals.length;

  res.json({ success: true, signalCount, signals });
});

// for retriving all signal with same circle.

exports.getSignalsByCircleId = catcherror(async (req, res) => {
  const circleId = req.body.circleId;

  try {
    const signals = await TrafficSignal.find({ circleId: circleId });

    if (signals) {
      signals.forEach((signal) => {
        const elapsedTime = getElapsedTime(signal);
  
        const liveTime = getTrafficLightStatus(
          elapsedTime,
          signal.aspects.currentColor,
          signal.aspects.durationInSeconds
        );
        signal.aspects.currentColor = liveTime.color;
        signal.aspects.durationInSeconds = liveTime.duration;
      });
      res.status(200).json({
        success: true,
        signals,
      });
    } else {
      next(new ErrorHandler("Can't get signals for the specified circle ID"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

exports.liveUpdateSignal = catcherror(async (req, res) => {
  const { durationInSeconds, currentColor } = req.body;
  console.log(durationInSeconds)
  try {
    const updatedSignal = await TrafficSignal.findByIdAndUpdate(
      req.params.Id,
      {
        "aspects.durationInSeconds": durationInSeconds,
        "aspects.currentColor": currentColor,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.json(updatedSignal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




