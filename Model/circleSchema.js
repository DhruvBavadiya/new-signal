const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  circleId: {
    type: String,
    required: true,
    
  },
  numberOfSignals: {
    type: Number,
    required: true,
    default:0
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
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
  signalIds: [{
    type: Number, // Adjust the type accordingly based on your signalId type in TrafficSignal schema
    ref: 'TrafficSignal',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

// Update the updatedAt field before saving the document, only if it's an update
circleSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

const Circle = mongoose.model('Circle', circleSchema);

module.exports = Circle;
