const TrafficSignal = require("../Model/trafficSignalSchema");

exports.updateAllSignalsSideToLeft = async (req, res) => {
    try {
        const signals = await TrafficSignal.find({}); // Fetch all signals
        console.log(signals);
        let updatedCount = 0;

        for (const signal of signals) {
            signal.side = 'left'; // Update the side field to 'left'
            signal.aspects.currentColor = "red"; // Set aspects.currentColor to null or another default value
            await signal.save(); // Save the updated signal
            updatedCount++
        }

        console.log(`${updatedCount} signals updated successfully to side "left"`);

        res.status(200).json({ message: `${updatedCount} signals updated successfully to side "left"` });
    } catch (error) {
        console.error('Error updating signals side:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
