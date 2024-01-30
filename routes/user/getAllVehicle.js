const express = require("express");

const{ getAllVehicle } = require("../../controller/user/getAllVehicaleController");
const { validateToken } = require("../../controller/common/auth");

const route = express.Router();

route.get("/getAllVehicle", validateToken, getAllVehicle );

module.exports = route;