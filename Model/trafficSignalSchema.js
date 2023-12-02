const mongoose = require("mongoose");

const trafficSignalSchema = new mongoose.Schema({
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    angle: {
      type: Number,
      required: true,
    },
  },
  address: {
    circleName: {
      type: String,
      // required: true,
    },
    road: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },
  junctionType: {
    type: String,
    enum: ["crossroads with traffic light", "T-junction with traffic light"],
    required: true,
  },

  aspects: {
    red: {
      type: Number,
      default: 90,
    },

    yellow: {
      type: Number,
      default: 5,
    },
    green: {
      type: Number,
      default: 30,
    },

    currentColor: {
      type: String,
      enum: ["red", "yellow", "green"],
      required: true,
    },
    durationInSeconds: {
      type: Number,
      required: true,
    },
  },
  signalStatus: {
    type: String,
    enum: ["working", "notworking"],
    default: "working",
  },
  signalId: {
    type: String, // Adjust the type accordingly (String, ObjectId, etc.)
    required: true,
    unique: true,
  },
  circleId: {
    type: String, // Adjust the type accordingly (String, ObjectId, etc.)
    required: true,
  },
  createdAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  signalNotWorking: {
    signalOfftime: {
      type: Date,
    },
    signalOfftime: {
      type: Date,
    },
  },
});

// Update the updatedAt field before saving the document, only if it's an update
trafficSignalSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

const TrafficSignal = mongoose.model("TrafficSignal", trafficSignalSchema);

module.exports = TrafficSignal;
