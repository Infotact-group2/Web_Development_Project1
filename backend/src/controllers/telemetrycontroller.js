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


const deletetelemetry=async (req,res)=>{
    try{
      const deletevehicle=await vehicles.findOneAndDelete({ vehicleId: req.params.id })
        if(!deletevehicle){
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }
          return res.status(200).json({
            success: true,
            message: "Telemetry deleted successfully"
        })
    }catch(err){
        return res.status(400).json({msge:"something went wrong: "+ err.message})
    }
}


const updatetelemetry = async (req, res) => {
    try {
        const updatedvehicle = await vehicles.findOneAndUpdate(
            { vehicleId: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatedvehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedvehicle
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addtelemetry,
    gettelemetry,
    deletetelemetry,
    updatetelemetry
}
