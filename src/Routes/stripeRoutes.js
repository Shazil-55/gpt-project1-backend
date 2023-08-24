// routes/adminRoutes.js

const express = require("express");
const stripeController = require("../Controllers/stripeController");

const router = express.Router();



router.post("/", stripeController.validateRequest);




module.exports = router;
