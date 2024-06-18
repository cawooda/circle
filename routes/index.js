const express = require("express");
const router = express.Router();

//methods within the controller handle CRUD requests. The methods are imported here
const {
  postData,
  getData,
  putData,
  deleteData,
} = require("../controllers/index");

//all calls to api arive here and are separated out into CRUD requests to be handled by the controller

router
  .post("/", postData)
  .get("/", getData)
  .put("/", putData)
  .delete("/", deleteData);

module.exports = router;
