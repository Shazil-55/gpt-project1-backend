// routes/adminRoutes.js

const express = require("express");
const adminController = require("../Controllers/adminController");

const router = express.Router();

// Delete user route
router.delete("/DeleteUser", adminController.deleteUser);

// Update user route
router.put("/updateUser/:id", adminController.updateUser);

// Get data route
router.get("/getData", adminController.getData);


router.post("/addUser", adminController.addUser);




module.exports = router;
