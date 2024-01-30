const express = require("express");

const router = express.Router();

const { registration } = require("../../controller/admin/driverRegistration");
const { validateToken } = require("../../controller/common/auth");

router.post("/registration", validateToken, registration);

module.exports = router;
