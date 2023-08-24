// routes/userRoutes.js

const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();
function f2(req,res,next){
console.log("f2")
next()
}

// Get user route 



router.get("/getEmail", userController.getEmail);
router.get("/getKey", userController.getKey);
router.get("/getGptApi", userController.getGptApi);
router.get("/getPrompts", userController.getPrompts);
router.get("/getAllPrompts", userController.getAllPrompts);

router.get("/getReplyPrompts", userController.getReplyPrompts);

router.get("/getSetting", userController.getSetting);
router.get("/validUser", userController.validUser);
router.get("/getChatsResponse", userController.getChatsResponse);
router.get("/getChats", userController.getChats);
router.get("/getShortCuts", userController.getShortCuts);

router.delete("/delPrompts", userController.delPrompts);
router.delete("/deleteChat", userController.deleteChat);


router.put("/updateGptApi", userController.updateGptApi);
router.put("/EditPrompts", userController.EditPrompts);
router.put("/updateTitle", userController.updateTitle);
router.post("/saveChat", userController.saveChat);
router.post("/saveExtendChat", userController.saveExtendChat);
router.post("/saveNewChat", userController.saveNewChat);
router.post("/SaveShortCuts", userController.SaveShortCuts);
router.post("/generateGptResponse", userController.generateGptResponse);
router.post("/createNewChat", userController.createNewChat);



router.post("/setSetting", userController.setSetting);




// Update user route
// router.put("/:id",f2, userController.updateUser);

// Sign In User
router.post("/login", f2 , userController.loginuser)
router.post("/saveRole", f2 , userController.SaveRole)

module.exports = router;
