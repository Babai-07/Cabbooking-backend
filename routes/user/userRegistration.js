const express = require("express");

const router = express.Router();

const {registration} = require("../../controller/user/registrationController")

router.post("/registration", registration);

module.exports = router; 