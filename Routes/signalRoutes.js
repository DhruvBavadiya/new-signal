const express = require("express");
const { addSignalLightData, signalByCoordinates, getAll, getSignalById, updateSignal, getSignalsByCircleId, liveUpdateSignal } = require("../Controller/SignalLightController");
const { addCircle, getCircle, getAllCircle } = require("../Controller/circleController");
const router = express.Router()


router.route('/add-circle').post(addCircle)
router.route('/add-signal-light').post(addSignalLightData)
router.route('/get-signal/bycoordinates').get(signalByCoordinates)
router.route('/get-signal/bycircle').get(getSignalsByCircleId)
router.route('/get-signal').get(getAll)
router.route('/get-circle/byId').get(getCircle)
router.route('/get-circle').get(getAllCircle)
router.route('/get-signal/byId').get(getSignalById)
router.route('/update-signal/:Id').put(updateSignal)
router.route('/live-update/:Id').put(liveUpdateSignal)

module.exports = router