const express = require("express");

const router = express.Router();

const {login , validateToken} = require("./../../controller/common/auth");

router.post("/login/:type", login);

router.get("/auth", validateToken);

module.exports = router;