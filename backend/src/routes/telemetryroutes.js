const express = require("express")
const router = express.Router()
const { addtelemetry, gettelemetry } = require("../controllers/telemetrycontroller")

router.post('/addtelemetry', addtelemetry)
router.get('/gettelemetry', gettelemetry)

module.exports = router
