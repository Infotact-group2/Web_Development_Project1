const mongoose = require("mongoose")
const vehicleSchema = new mongoose.Schema({
vehicleId: {
    type: String,
    required: true
  },
  latitude:Number,
  longitude:Number,
  speed:Number,
  timestamp:Date
    
})

const vehicles=mongoose.model("vehicle",vehicleSchema)
module.exports=vehicles