const express = require("express");
const router = express.Router();
const apiRoutes = require("./api");

//middlwhere handling all api requets using apiRoutes

router.use("/api", apiRoutes);

module.exports = router;
