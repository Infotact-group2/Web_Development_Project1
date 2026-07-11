const express = require("express")
const cors = require("cors")
const app = express()
const telemetryroutes = require("./routes/telemetryroutes")

//  Add middleware
app.use(express.json())
app.use(cors())

// Test Route
app.get("/", (req, res) => {
    res.send("fleetdash is working")
})

app.use("/api/telemetry", telemetryroutes);

// exporting the file 
module.exports = app