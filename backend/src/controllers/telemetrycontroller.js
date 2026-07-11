const vehicles = require("../models/vehicles")

// this is used to add the telemetry in database 

const addtelemetry = async (req, res) => {
    try {
        const { vehicleId, latitude, longitude, speed, timestamp } = req.body
        const telemetry = new vehicles({
            vehicleId,
            latitude,
            longitude,
            speed,
            timestamp
        })

        await telemetry.save()
        return res.status(201).json({
            msge: "Telemetry data added successfully",
            data: telemetry
        })

    } catch (err) {
        res.status(411).json({ msge: "something went wrong: " + err.message })
    }
}

const gettelemetry = async (req, res) => {
    try {
        const getvehicles = await vehicles.find();

        res.status(200).json({
            success: true,
            count: getvehicles.length,
            data: getvehicles,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    addtelemetry,
    gettelemetry
}
