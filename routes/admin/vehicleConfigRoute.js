const express = require("express");
const {
    addVehicle, updateVehicle, deleteVehicle, getAllVehicle, uplode
}= require("../../controller/admin/vehicleConfigController");
const { validateToken } = require("../../controller/common/auth");

const route = express.Router();

route.get("/getAllVehicle", validateToken, getAllVehicle);
route.post("/addVehicle", validateToken, addVehicle);
route.patch("/updateVehicle/:id", validateToken, updateVehicle);
route.delete("/deleteVehicle/:id", validateToken, deleteVehicle);
route.post("/carImage", uplode.single("image"), async (req, res) =>{
    console.log(req.file);
});

module.exports = route;