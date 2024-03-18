const catcherror = require("../Middleware/catcherror");
// const ErrorHandler = require("../Utils/errorHandler");
// const TrafficSignal = require("../Model/trafficSignalSchema");
// const Circle = require("../Model/circleSchema");

// exports.addSignalLightData = catcherror(async (req, res, next) => {
//   try {
//     const data = req.body;
//     const circleId = data.circleId;

//     // Find the circle based on circleId
//     const circle = await Circle.findOne({ circleId });

//     if (circle) {
//       // Calculate default values for other lights based on the provided color
//       // Create a new signal light with the calculated values
//       const newSignalLight = new TrafficSignal(data);

//       // Save the signal light to the database
//       const savedSignalLight = await newSignalLight.save();

//       // Update the circle's signalIds array by pushing the signalId of the saved signal light
//       circle.signalIds.push(savedSignalLight.signalId);
//       circle.numberOfSignals += 1;

//       // Save the updated circle
//       await circle.save();

//       res.status(201).json(savedSignalLight);
//     } else {
//       return next(new ErrorHandler("No circle for this id.", 401));
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// exports.updateSignal = async (req, res) => {
//   const updates = req.body;

//   try {
//     // Find the signal by ID
//     const signal = await TrafficSignal.findById(req.params.Id);

//     // Check if the signal exists
//     if (!signal) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Signal not found" });
//     }

//     // Update the signal aspects based on the provided updates
//     Object.assign(signal.aspects, updates);

//     await signal.save();

//     res.json({ success: true, message: "Signal updated successfully", signal });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// exports.getAll = catcherror(async (req, res, next) => {
//   try {
//     const signals = await TrafficSignal.find({ signalStatus: "working" }, "aspects");
  
//     await Promise.all(signals.map(async (signal) => {
//       const elapsedTime = getElapsedTime(signal);
//       const liveTime = getTrafficLightStatus(
//         signal,
//         elapsedTime,
//         signal.aspects.currentColor,
//         signal.aspects.durationInSeconds
//       );
//       await TrafficSignal.findByIdAndUpdate(signal._id, {
//         "aspects.currentColor": liveTime.color,
//         "aspects.durationInSeconds": liveTime.duration
//       });
//     }));
  
//     res.status(200).json({
//       success: true,
//       signals // Return the updated signals
//     });
//   } catch (error) {
//     // Handle errors gracefully
//     next(new ErrorHandler("Error fetching signals", 500));
//   }
// });


// exports.getSignalById = catcherror(async (req, res, next) => {
//   const signalId = req.body.signalId;
//   console.log("hello -1");

//   const signal = await TrafficSignal.findOne({ signalId });
//   console.log("hello")
//   if (!signal) {
//     return next(new ErrorHandler("Signal not found"));
//   }
//   if (signal.signalStatus == "notworking") {
//     return res.status(201).json({
//       success: true,
//       message: "signal not working",
//       signal,
//     });
//   }
//   const elapsedTime = getElapsedTime(signal);

//   const liveTime = getTrafficLightStatus(
//     signal,
//     elapsedTime,
//     signal.aspects.currentColor,
//     signal.aspects.durationInSeconds
//   );
//   signal.aspects.currentColor = liveTime.color;
//   signal.aspects.durationInSeconds = liveTime.duration;
//   // await signal.save()
//   // console.log(liveTime)
//   res.status(200).json({
//     success: true,
//     signal,
//   });
// });

// exports.signalOff = catcherror(async (req, res, next) => {
//   // const signalId = req.Query.signalId
//   // console.log(signalId)
//   const signal = await TrafficSignal.findOne({ signalId: req.params.signalId });
//   console.log(signal);
//   signal.signalNotWorking.signalOfftime = Date.now();
//   signal.signalStatus = "notworking";
//   await signal.save();

//   res.status(200).json({
//     message: "signal is off",
//   });
// });
// exports.signalOn = catcherror(async (req, res, next) => {
//   const signal = await TrafficSignal.findOne({ signalId: req.params.signalId });
//   signal.signalStatus = "working";
//   signal.signalNotWorking.signalOfftime = null;
//   (signal.aspects.currentColor = "red"),
//     (signal.aspects.durationInSeconds = 90);
//   await signal.save();

//   res.status(200).json({
//     success: true,
//     message: "signal is on",
//     signal,
//   });
// });

// // process of finding elapsedTime

// function getElapsedTime(signal) {
//   const currentTime = new Date().getTime();
//   const lastUpdateTime = new Date(signal.updatedAt).getTime();
//   const elapsedTime = (currentTime - lastUpdateTime) / 1000;
//   return Math.floor(elapsedTime);
// }

// // function getTrafficLightStatus(elapsedTime, initialColor, initialDuration) {
// //   // Define the durations for each color
// //   const redDuration = 90;
// //   const yellowDuration = 5;
// //   const greenDuration = 30;

// //   // Calculate the total cycle duration
// //   const totalCycleDuration = redDuration + greenDuration + yellowDuration;
// //   console.log("total cycle duration",totalCycleDuration)
// //   // Calculate the current cycle number
// //   const currentCycle = Math.floor(elapsedTime / totalCycleDuration);
// //   console.log("currentcycle",currentCycle)

// //   // Calculate the remaining time within the current cycle
// //   const remainingTimeInCycle = elapsedTime % totalCycleDuration;

// //   console.log("remaining time",remainingTimeInCycle)
// //   // Determine the current color and duration based on the remaining time
// //   let currentColor, currentDuration;
// //   if (remainingTimeInCycle < initialDuration) {
// //     currentColor = initialColor;
// //     currentDuration = initialDuration - remainingTimeInCycle;
// //   } else if (remainingTimeInCycle < greenDuration + initialDuration) {
// //     currentColor = "green";
// //     currentDuration = greenDuration - (remainingTimeInCycle - initialDuration);
// //   } else if (remainingTimeInCycle < totalCycleDuration) {
// //     currentColor = "yellow";
// //     currentDuration =
// //       yellowDuration - (remainingTimeInCycle - (greenDuration + initialDuration));
// //   } else {
// //     currentColor = "red";
// //     currentDuration =
// //       redDuration - (remainingTimeInCycle - (totalCycleDuration));
// //   }
// //   console.log("currenColor",currentColor)
// //   console.log("duration",currentDuration)

// //   return {
// //     color: currentColor,
// //     duration: Math.floor(currentDuration), // Ensure the duration is non-negative
// //   };
// // }

// function getTrafficLightStatus(signal,elapsedTime, initialColor, initialDuration) {
//   // Define the durations for each color
//   const redDuration = signal.aspects.red;
//   const yellowDuration = signal.aspects.yellow;
//   const greenDuration = signal.aspects.green;

//   let elapTime = elapsedTime;
//   let curcolor = initialColor;
//   let colorduration = initialDuration;

//   while (elapTime >= colorduration) {
//     if (curcolor === "green") {
//       curcolor = "yellow";
//       elapTime -= colorduration;
//       colorduration = yellowDuration;
//     } else if (curcolor === "yellow") {
//       curcolor = "red";
//       elapTime -= colorduration;
//       colorduration = redDuration;
//     } else {
//       curcolor = "green";
//       elapTime -= colorduration;
//       colorduration = greenDuration;
//     }
//   }

//   if (elapTime < colorduration) {
//     colorduration -= elapTime; // Corrected subtraction
//     return {
//       color: curcolor,
//       duration: Math.floor(colorduration), // Ensure the duration is non-negative
//     };
//   }
//   else{
//     return {
//       color: curcolor,
//       duration: Math.floor(colorduration), 
//     };
//   }
// }

// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c;
//   return distance * 1000; // Distance in kilometers
// }

// // // exports.signalByCoordinates = catcherror(async (req, res) => {
// // //   const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers
// // //   let distances = []; // Array to store distances
// // //   let signals = []; // Array to store signals

// // //   const latitude = parseFloat(lat);
// // //   const longitude = parseFloat(lon);
// // //   const distanceInRadians = maxDistance / 6371;
// // //   console.log(distanceInRadians," ", maxDistance)
// // //   // Find signals within the specified distance
// // //   const allSignals = await TrafficSignal.find({
// // //     location: {
// // //       $geoWithin: {
// // //         $centerSphere: [[latitude, longitude], distanceInRadians], // Convert distance to radians
// // //       },
// // //     },
// // //   });

// // //   // Calculate distances for each signal
// // //   allSignals.forEach((signal) => {
// // //     const signalDistance = calculateDistance(
// // //       lat,
// // //       lon,
// // //       signal.location.latitude,
// // //       signal.location.longitude
// // //     );

// // //       // Add the signal and distance to the arrays
// // //       signals.push(signal);
// // //       distances.push(signalDistance);

// // //       const elapsedTime = getElapsedTime(signal);

// // //     const liveTime = getTrafficLightStatus(
// // //       elapsedTime,
// // //       signal.aspects.currentColor,
// // //       signal.aspects.durationInSeconds
// // //     );
// // //     signal.aspects.currentColor = liveTime.color;
// // //     signal.aspects.durationInSeconds = liveTime.duration;
// // //   });

// // //   // Sort signals and distances arrays based on distances
// // //   const sortedIndices = distances.map((_, index) => index);
// // //   sortedIndices.sort((a, b) => distances[a] - distances[b]);

// // //   signals = sortedIndices.map((index) => signals[index]);
// // //   distances = sortedIndices.map((index) => distances[index]);

// // //   const signalCount = signals.length;

// // //   res.json({ success: true, signalCount, signals, distances });
// // // });

// const geolib = require("geolib");

// exports.signalByCoordinates = catcherror(async (req, res) => {
//   const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers
//   let distances = []; // Array to store distances
//   let signals = []; // Array to store signals

//   const latitude = parseFloat(lat);
//   const longitude = parseFloat(lon);
//   const maxDistanceInMeters = maxDistance * 1000; // Convert maxDistance to meters

//   try {
//     // Find signals within the specified distance
//     const allSignals = await TrafficSignal.find();

//     const signalsWithinDistance = allSignals.filter((signal) => {
//       if (
//         signal.location &&
//         signal.location.latitude &&
//         signal.location.longitude
//       ) {
//         const signalDistance = geolib.getDistance(
//           { latitude, longitude },
//           {
//             latitude: signal.location.latitude,
//             longitude: signal.location.longitude,
//           }
//         );
//         signal.distance = signalDistance;
//         return signalDistance <= maxDistanceInMeters;
//       }
//       return false;
//     });

//     // Sort signals within distance by distance (ascending order)
//     signalsWithinDistance.sort((a, b) => a.distance - b.distance);

//     // Extract distances for console logging
//     distances = signalsWithinDistance.map((signal) => signal.distance);

//     const signalCount = signalsWithinDistance.length;

//     console.log("Sorted Distances:", distances); // Console log sorted distances

//     res.json({ success: true, signalCount, signals: signalsWithinDistance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // // for retriving all signal with same circle.

// // exports.getSignalsByCircleId = catcherror(async (req, res) => {
// //   const circleId = req.body.circleId;

// //   try {
// //     const signals = await TrafficSignal.find({ circleId: circleId });

// //     if (signals) {
// //       signals.forEach((signal) => {
// //         const elapsedTime = getElapsedTime(signal);

// //         const liveTime = getTrafficLightStatus(
// //           signal,
// //           elapsedTime,
// //           signal.aspects.currentColor,
// //           signal.aspects.durationInSeconds
// //         );
// //         signal.aspects.currentColor = liveTime.color;
// //         signal.aspects.durationInSeconds = liveTime.duration;
// //       });
// //       res.status(200).json({
// //         success: true,
// //         signals,
// //       });
// //     } else {
// //       next(new ErrorHandler("Can't get signals for the specified circle ID"));
// //     }
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ success: false, message: "Internal Server Error" });
// //   }
// // });

// // exports.liveUpdateSignal = catcherror(async (req, res) => {
// //   const { durationInSeconds, currentColor } = req.body;
// //   console.log(durationInSeconds);
// //   try {
// //     const updatedSignal = await TrafficSignal.findByIdAndUpdate(
// //       req.params.Id,
// //       {
// //         "aspects.durationInSeconds": durationInSeconds,
// //         "aspects.currentColor": currentColor,
// //         updatedAt: Date.now(),
// //       },
// //       { new: true }
// //     );
// //     res.json(updatedSignal);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // exports.changeSignalTime = catcherror(async (req, res, next) => {
// //   const signalId = req.body.Id;
// //   const signal = await TrafficSignal.findOne({ signalId: signalId });
// //   if (signal) {
// //     const data = req.body;

// //     signal.aspects.green = data.green;
// //     signal.aspects.yellow = data.yellow;
// //     signal.aspects.red = data.red;
// //     signal.aspects.currentColor = 'red';
// //     signal.aspects.durationInSeconds = data.red;
// //     await signal.save();
// //   } else {
// //     return next(new ErrorHandler("No signal for this id.", 401));
// //   }

// //   res.status(201).json({
// //     signal,
// //     message: "success",
// //   });
// // });


// // exports.deleteSignal = catcherror(async(req,res,next)=>{
// //   const signalId = req.body.signalId;

// //   if(!signalId){
// //     return next(new ErrorHandler("signal id is not provided.", 401));
// //   }

// //   const signal = await TrafficSignal.findOne({signalId:signalId})
// //   if(!signal){
// //     return next(new ErrorHandler("No signal for this id.", 401));
// //   }

// //   await signal.deleteOne({signalId:signalId});

// //   res.status(201).json({
// //     message:"success"
// //   })
// // })





// const ErrorHandler = require("../Utils/errorHandler");
// const TrafficSignal = require("../Model/trafficSignalSchema");
// const Circle = require("../Model/circleSchema");
// const NodeCache = require("node-cache");
// const cache = new NodeCache();

// // Rest of your code remains unchanged

// exports.addSignalLightData = catcherror(async (req, res, next) => {
//   try {
//     const data = req.body;
//     const circleId = data.circleId;

//     // Find the circle based on circleId
//     const circle = await Circle.findOne({ circleId });

//     if (circle) {
//       // Calculate default values for other lights based on the provided color
//       // Create a new signal light with the calculated values
//       const newSignalLight = new TrafficSignal(data);

//       // Save the signal light to the database
//       const savedSignalLight = await newSignalLight.save();

//       // Update cache with saved data
//       cache.set(`signal:${savedSignalLight.signalId}`, savedSignalLight);

//       res.status(201).json(savedSignalLight);
//     } else {
//       return next(new ErrorHandler("No circle for this id.", 401));
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// exports.updateSignal = async (req, res) => {
//   const updates = req.body;

//   try {
//     // Find the signal by ID
//     const signal = await TrafficSignal.findById(req.params.Id);

//     // Check if the signal exists
//     if (!signal) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Signal not found" });
//     }

//     // Update the signal aspects based on the provided updates
//     Object.assign(signal.aspects, updates);

//     // Update cache with updated data
//     cache.set(`signal:${signal.signalId}`, signal);

//     await signal.save();

//     res.json({ success: true, message: "Signal updated successfully", signal });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// exports.getAll = catcherror(async (req, res, next) => {
//     // Check cache for all signals
//     const cachedSignals = cache.get("signals");

//     if (cachedSignals) {
//       return res.status(200).json({
//         success: true,
//         signals: cachedSignals,
//       });
//     }

//     const signals = await TrafficSignal.find({ signalStatus: "working" }, "aspects");
  
//     await Promise.all(signals.map(async (signal) => {
//       const elapsedTime = getElapsedTime(signal);
//       const liveTime = getTrafficLightStatus(
//         signal,
//         elapsedTime,
//         signal.aspects.currentColor,
//         signal.aspects.durationInSeconds
//       );
//       await TrafficSignal.findByIdAndUpdate(signal._id, {
//         "aspects.currentColor": liveTime.color,
//         "aspects.durationInSeconds": liveTime.duration
//       });
//     }));

//     // Update cache with all signals
//     cache.set("signals", signals);

//     res.status(200).json({
//       success: true,
//       signals // Return the updated signals
//     });
//     // Handle errors gracefully
// });


// exports.getSignalById = catcherror(async (req, res, next) => {
//   const signalId = req.body.signalId;

//   try {
//     // Check cache for signal by ID
//     const cachedData = cache.get(`signal:${signalId}`);

//     if (cachedData) {
//       const signal = cachedData;
//       return res.status(200).json({
//         success: true,
//         signal,
//       });
//     }

//     const signal = await TrafficSignal.findOne({ signalId });

//     if (!signal) {
//       return next(new ErrorHandler("Signal not found"));
//     }

//     const elapsedTime = getElapsedTime(signal);
//     const liveTime = getTrafficLightStatus(
//       signal,
//       elapsedTime,
//       signal.aspects.currentColor,
//       signal.aspects.durationInSeconds
//     );
//     signal.aspects.currentColor = liveTime.color;
//     signal.aspects.durationInSeconds = liveTime.duration;

//     // Update cache with fetched data
//     cache.set(`signal:${signalId}`, signal);

//     res.status(200).json({
//       success: true,
//       signal,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// exports.signalOff = catcherror(async (req, res, next) => {
//   try {
//     const signalId = req.params.signalId;

//     const signal = await TrafficSignal.findOne({ signalId });

//     if (!signal) {
//       return next(new ErrorHandler("Signal not found"));
//     }

//     signal.signalNotWorking.signalOfftime = Date.now();
//     signal.signalStatus = "notworking";
//     await signal.save();

//     // Update cache with updated data
//     cache.set(`signal:${signalId}`, signal);

//     res.status(200).json({
//       message: "Signal is off",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// exports.signalOn = catcherror(async (req, res, next) => {
//   try {
//     const signalId = req.params.signalId;

//     const signal = await TrafficSignal.findOne({ signalId });

//     if (!signal) {
//       return next(new ErrorHandler("Signal not found"));
//     }

//     signal.signalStatus = "working";
//     signal.signalNotWorking.signalOfftime = null;
//     signal.aspects.currentColor = "red";
//     signal.aspects.durationInSeconds = 90;
//     await signal.save();

//     // Update cache with updated data
//     cache.set(`signal:${signalId}`, signal);

//     res.status(200).json({
//       message: "Signal is on",
//       signal,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Rest of the functions remain unchanged
// exports.getSignalsByCircleId = catcherror(async (req, res) => {
//   const circleId = req.body.circleId;

//   try {
//     // Check cache for signals by circleId
//     const cachedData = myCache.get(`signals:circle:${circleId}`);

//     if (cachedData) {
//       return res.status(200).json({
//         success: true,
//         signals: cachedData,
//       });
//     }

//     const signals = await TrafficSignal.find({ circleId });

//     if (signals) {
//       // Update cache with fetched data
//       myCache.set(`signals:circle:${circleId}`, signals);

//       res.status(200).json({
//         success: true,
//         signals,
//       });
//     } else {
//       next(new ErrorHandler("Can't get signals for the specified circle ID"));
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// exports.liveUpdateSignal = catcherror(async (req, res) => {
//   const { durationInSeconds, currentColor } = req.body;
//   const signalId = req.params.Id;

//   try {
//     const updatedSignal = await TrafficSignal.findByIdAndUpdate(
//       signalId,
//       {
//         "aspects.durationInSeconds": durationInSeconds,
//         "aspects.currentColor": currentColor,
//         updatedAt: Date.now(),
//       },
//       { new: true }
//     );

//     // Update cache with updated data
//     myCache.set(`signal:${signalId}`, updatedSignal);

//     res.json(updatedSignal);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// exports.changeSignalTime = catcherror(async (req, res, next) => {
//   const signalId = req.body.Id;

//   try {
//     const signal = await TrafficSignal.findOneAndUpdate(
//       { signalId },
//       {
//         $set: {
//           "aspects.green": req.body.green,
//           "aspects.yellow": req.body.yellow,
//           "aspects.red": req.body.red,
//           "aspects.currentColor": "red",
//           "aspects.durationInSeconds": req.body.red,
//         },
//       },
//       { new: true }
//     );

//     // Update cache with updated data
//     myCache.set(`signal:${signalId}`, signal);

//     res.status(201).json({
//       signal,
//       message: "success",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// exports.deleteSignal = catcherror(async (req, res, next) => {
//   const signalId = req.body.signalId;

//   if (!signalId) {
//     return next(new ErrorHandler("Signal id is not provided.", 401));
//   }

//   try {
//     const signal = await TrafficSignal.findOne({ signalId });

//     if (!signal) {
//       return next(new ErrorHandler("No signal for this id.", 401));
//     }

//     await signal.deleteOne({ signalId });

//     // Remove signal from cache
//     myCache.del(`signal:${signalId}`);

//     res.status(201).json({
//       message: "success",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });







const NodeCache = require("node-cache");
const cache = new NodeCache();
const ErrorHandler = require("../Utils/errorHandler");
const TrafficSignal = require("../Model/trafficSignalSchema");
const Circle = require("../Model/circleSchema");
const geolib = require("geolib");

const cacheDurationInSeconds = 600; // Adjust the cache duration as needed

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

      // cache.del("allSignals"); // Clear the cached signals
      // const cacheKey = `${newSignalLight.location.latitude}_${newSignalLight.location.longitude}_${maxDistance}`;
      // cache.del(cacheKey);
      const keys = cache.keys();
      keys.forEach(key => cache.del(key));

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

    const keys = cache.keys();
    keys.forEach(key => cache.del(key));

    res.json({ success: true, message: "Signal updated successfully", signal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAll = catcherror(async (req, res, next) => {
  const cachedSignals = cache.get("allSignals");
  if (cachedSignals) {
    const signalsArray = JSON.parse(cachedSignals); // Parse cached string back into an array
    res.status(200).json({
      success: true,
      signals: signalsArray,
      message: "Data retrieved from cache",
    });
  } else {
    try {
      const signals = await TrafficSignal.find();
      if (signals) {
        signals.forEach((signal) => {
          const elapsedTime = getElapsedTime(signal);
          const liveTime = getTrafficLightStatus(
            signal,
            elapsedTime,
            signal.aspects.currentColor,
            signal.aspects.durationInSeconds
          );
          signal.aspects.currentColor = liveTime.color;
          signal.aspects.durationInSeconds = liveTime.duration;
        });

        console.log(signals); // Log the original signals

        // Stringify the signals array before storing it in the cache
        const signalsString = JSON.stringify(signals);
        cache.set("allSignals", signalsString, cacheDurationInSeconds);

        res.status(200).json({
          success: true,
          signals: signals,
          message: "Data retrieved from database",
        });
      } else {
        next(new ErrorHandler("Can't get Place"));
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
});




exports.getSignalById = catcherror(async (req, res, next) => {
  const signalId = req.body.signalId;

  try {
    // Check if the signal is cached
    const cachedSignal = cache.get(signalId);
    if (cachedSignal) {
      const parsedSignal = JSON.parse(cachedSignal); // Parse cached string back into an object
      return res.status(200).json({
        success: true,
        signal: parsedSignal, // Return the cached signal directly
        message: "Signal fetched from cache",
      });
    }

    const signal = await TrafficSignal.findOne({ signalId });
    if (!signal) {
      return next(new ErrorHandler("Signal not found"));
    }

    if (signal.signalStatus == "notworking") {
      return res.status(201).json({
        success: true,
        message: "Signal not working",
        signal,
      });
    }

    const elapsedTime = getElapsedTime(signal);
    const liveTime = getTrafficLightStatus(
      signal,
      elapsedTime,
      signal.aspects.currentColor,
      signal.aspects.durationInSeconds
    );

    signal.aspects.currentColor = liveTime.color;
    signal.aspects.durationInSeconds = liveTime.duration;

    // Stringify the signal object before caching
    const stringifiedSignal = JSON.stringify(signal);
    // Cache the entire signal object
    cache.set(signalId, stringifiedSignal);

    res.status(200).json({
      success: true,
      signal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



exports.signalOff = catcherror(async (req, res, next) => {
  const signal = await TrafficSignal.findOne({ signalId: req.params.signalId });
  console.log(signal);
  signal.signalNotWorking.signalOfftime = Date.now();
  signal.signalStatus = "notworking";
  await signal.save();

  const keys = cache.keys();
  keys.forEach(key => cache.del(key));

  res.status(200).json({
    message: "signal is off",
  });
});

exports.signalOn = catcherror(async (req, res, next) => {
  const signal = await TrafficSignal.findOne({ signalId: req.params.signalId });
  signal.signalStatus = "working";
  signal.signalNotWorking.signalOfftime = null;
  (signal.aspects.currentColor = "red"),
    (signal.aspects.durationInSeconds = 90);
  await signal.save();

  const keys = cache.keys();
  keys.forEach(key => cache.del(key));

  res.status(200).json({
    success: true,
    message: "signal is on",
    signal,
  });
});

// exports.signalByCoordinates = catcherror(async (req, res) => {
//   const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers
//   let distances = []; // Array to store distances
//   let signals = []; // Array to store signals

//   const latitude = parseFloat(lat);
//   const longitude = parseFloat(lon);
//   const maxDistanceInMeters = maxDistance * 1000; // Convert maxDistance to meters

//   try {
//     // Find signals within the specified distance
//     const allSignals = await TrafficSignal.find();

//     const signalsWithinDistance = allSignals.filter((signal) => {
//       if (
//         signal.location &&
//         signal.location.latitude &&
//         signal.location.longitude
//       ) {
//         const signalDistance = geolib.getDistance(
//           { latitude, longitude },
//           {
//             latitude: signal.location.latitude,
//             longitude: signal.location.longitude,
//           }
//         );
//         signal.distance = signalDistance;
//         return signalDistance <= maxDistanceInMeters;
//       }
//       return false;
//     });

//     // Sort signals within distance by distance (ascending order)
//     signalsWithinDistance.sort((a, b) => a.distance - b.distance);

//     // Extract distances for console logging
//     distances = signalsWithinDistance.map((signal) => signal.distance);

//     const signalCount = signalsWithinDistance.length;

//     console.log("Sorted Distances:", distances); // Console log sorted distances

//     res.json({ success: true, signalCount, signals: signalsWithinDistance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

exports.signalByCoordinates = catcherror(async (req, res) => {
  const { lat, lon, maxDistance } = req.body; // Latitude, longitude, and maximum distance in kilometers
  const maxDistanceInMeters = maxDistance * 1000; // Convert maxDistance to meters

  try {
    // Generate cache key
    const cacheKey = `${lat}_${lon}_${maxDistance}`;

    // Check if the results are already cached
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log("Returning cached results");
      const parsedResult = JSON.parse(cachedResult); // Parse cached string back into an object
      return res.json(parsedResult);
    }

    // Find signals within a bounding box approximation
    const boundingBox = geolib.getBoundsOfDistance({ latitude: lat, longitude: lon }, maxDistanceInMeters);
    
    // Query for signals within the bounding box
    const signalsWithinBoundingBox = await TrafficSignal.find({
      'location.latitude': { $gte: boundingBox[0].latitude, $lte: boundingBox[1].latitude },
      'location.longitude': { $gte: boundingBox[0].longitude, $lte: boundingBox[1].longitude }
    });

    // Filter signals within the maximum distance
    const signalsWithinMaxDistance = signalsWithinBoundingBox.filter(signal => {
      const signalDistance = geolib.getDistance(
        { latitude: lat, longitude: lon },
        { latitude: signal.location.latitude, longitude: signal.location.longitude }
      );
      return signalDistance <= maxDistanceInMeters;
    });

    // Cache the results
    const resultToCache = { success: true, signalCount: signalsWithinMaxDistance.length, signals: signalsWithinMaxDistance };
    const stringifiedResult = JSON.stringify(resultToCache); // Stringify the result before caching
    cache.set(cacheKey, stringifiedResult);

    // Return the results
    res.json(resultToCache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



exports.getSignalsByCircleId = catcherror(async (req, res, next) => {
  const circleId = req.body.circleId;

  try {
    // Check if signals for the circleId are cached
    const cachedSignals = cache.get(circleId);
    if (cachedSignals) {
      const parsedSignals = JSON.parse(cachedSignals); // Parse cached string back into an array
      parsedSignals.forEach((signal) => {
        const elapsedTime = getElapsedTime(signal);

        const liveTime = getTrafficLightStatus(
          signal,
          elapsedTime,
          signal.aspects.currentColor,
          signal.aspects.durationInSeconds
        );
        signal.aspects.currentColor = liveTime.color;
        signal.aspects.durationInSeconds = liveTime.duration;
      });

      return res.status(200).json({
        success: true,
        signals: parsedSignals,
        message: "Signals fetched from cache",
      });
    }

    const signals = await TrafficSignal.find({ circleId: circleId });

    if (signals.length > 0) {
      signals.forEach((signal) => {
        const elapsedTime = getElapsedTime(signal);

        const liveTime = getTrafficLightStatus(
          signal,
          elapsedTime,
          signal.aspects.currentColor,
          signal.aspects.durationInSeconds
        );
        signal.aspects.currentColor = liveTime.color;
        signal.aspects.durationInSeconds = liveTime.duration;
      });

      // Stringify the signals array before storing it in the cache
      const stringifiedSignals = JSON.stringify(signals);
      // Cache the signals for the circleId
      cache.set(circleId, stringifiedSignals);

      return res.status(200).json({
        success: true,
        signals,
      });
    } else {
      return next(new ErrorHandler("Can't get signals for the specified circle ID"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



exports.liveUpdateSignal = catcherror(async (req, res) => {
  const { durationInSeconds, currentColor } = req.body;
  console.log(durationInSeconds);
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
    const keys = cache.keys();
    keys.forEach(key => cache.del(key));

    res.json(updatedSignal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.changeSignalTime = catcherror(async (req, res, next) => {
  const signalId = req.body.Id;
  const signal = await TrafficSignal.findOne({ signalId: signalId });
  if (signal) {
    const data = req.body;

    signal.aspects.green = data.green;
    signal.aspects.yellow = data.yellow;
    signal.aspects.red = data.red;
    signal.aspects.currentColor = 'red';
    signal.aspects.durationInSeconds = data.red;
    await signal.save();

    const keys = cache.keys();
    keys.forEach(key => cache.del(key));
  } else {
    return next(new ErrorHandler("No signal for this id.", 401));
  }

  res.status(201).json({
    signal,
    message: "success",
  });
});

exports.deleteSignal = catcherror(async(req,res,next)=>{
  const signalId = req.body.signalId;

  if(!signalId){
    return next(new ErrorHandler("signal id is not provided.", 401));
  }

  const signal = await TrafficSignal.findOne({signalId:signalId})
  if(!signal){
    return next(new ErrorHandler("No signal for this id.", 401));
  }

  await signal.deleteOne({signalId:signalId});

        const keys = cache.keys();
      keys.forEach(key => cache.del(key));

  res.status(201).json({
    message:"success"
  })
});



function getElapsedTime(signal) {
    const currentTime = new Date().getTime();
    const lastUpdateTime = new Date(signal.updatedAt).getTime();
    const elapsedTime = (currentTime - lastUpdateTime) / 1000;
    return Math.floor(elapsedTime);
  }


  function getTrafficLightStatus(signal,elapsedTime, initialColor, initialDuration) {
    // Define the durations for each color
    const redDuration = signal.aspects.red;
    const yellowDuration = signal.aspects.yellow;
    const greenDuration = signal.aspects.green;
  
    let elapTime = elapsedTime;
    let curcolor = initialColor;
    let colorduration = initialDuration;
  
    while (elapTime >= colorduration) {
      if (curcolor === "green") {
        curcolor = "yellow";
        elapTime -= colorduration;
        colorduration = yellowDuration;
      } else if (curcolor === "yellow") {
        curcolor = "red";
        elapTime -= colorduration;
        colorduration = redDuration;
      } else {
        curcolor = "green";
        elapTime -= colorduration;
        colorduration = greenDuration;
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
      Math.cos(lat1  (Math.PI / 180)) 
        Math.cos(lat2  (Math.PI / 180)) 
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance * 1000; // Distance in kilometers
  }