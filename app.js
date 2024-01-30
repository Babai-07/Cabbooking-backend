const express = require("express");
const dotenv = require("dotenv");

const commonRoute = require("./routes/common/auth");
const userRoute = require("./routes/user/userRegistration");
const driverRoute = require("./routes/admin/driverRegis_route");
const adminRoute = require("./routes/admin/vehicleConfigRoute");
const userVehicleRoute = require("./routes/user/getAllVehicle");
const driverVehicleRoute = require("./routes/driver/getAllVehicle");
dotenv.config();

const app = express();

app.use(express.json());

app.use("/images", express.static("images"));

app.use(`${process.env.APP_VERSION}`, commonRoute);

app.use(`${process.env.APP_VERSION}/user`, userRoute);

app.use(`${process.env.APP_VERSION}/user`, userVehicleRoute);

app.use(`${process.env.APP_VERSION}/admin`, driverRoute);

app.use(`${process.env.APP_VERSION}/admin`, adminRoute);

app.use(`${process.env.APP_VERSION}/driver`, driverVehicleRoute);

app.use((req, res) => {
  return res.status(400).json({ status: 0, msg: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port" + process.env.PORT);
});
