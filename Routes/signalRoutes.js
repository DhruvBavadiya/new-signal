const express = require("express");
const { addSignalLightData, signalByCoordinates, getAll, getSignalById, updateSignal, getSignalsByCircleId, liveUpdateSignal, signalOff, signalOn, changeSignalTime, deleteSignal } = require("../Controller/SignalLightController");
const { addCircle, getCircle, getAllCircle, DeleteCircle, getCircleByCoordinates, updateCircle } = require("../Controller/circleController");
const { updateAllSignalsSideToLeft } = require("../Utils/setFields");
const router = express.Router()


router.route('/add-circle').post(addCircle)
router.put("/circle/update",updateCircle);
router.route('/get-circle/bycoordinates').post(getCircleByCoordinates)
router.route('/get-circle/byId').post(getCircle)
router.route('/get-circle').get(getAllCircle)
router.delete("/delete-circle",DeleteCircle)
router.route('/add-signal-light').post(addSignalLightData)
router.route('/get-signal/bycoordinates').post(signalByCoordinates)
router.route('/get-signal/bycircle').post(getSignalsByCircleId)
router.route('/get-signal').get(getAll)
router.route('/off-signal/:signalId').get(signalOff)
router.route('/on-signal/:signalId').get(signalOn)
router.route('/get-signal/byId').post(getSignalById)
router.route('/update-signal/:Id').put(updateSignal)
router.route('/live-update/:Id').put(liveUpdateSignal)
router.put("/signal/change-color",changeSignalTime)
router.delete("/signal/delete-signal",deleteSignal)
router.post("/test-fields",updateAllSignalsSideToLeft)

module.exports = router