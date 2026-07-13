const express = require("express")
const router = express.Router()
const { addtelemetry, gettelemetry,deletetelemetry, updatetelemetry } = require("../controllers/telemetrycontroller")

router.post('/addtelemetry', addtelemetry)
router.get('/gettelemetry', gettelemetry)
router.delete('/deletetelemetry/:id',deletetelemetry)
router.patch('/updatetelemetry/:id',updatetelemetry)

module.exports = router
