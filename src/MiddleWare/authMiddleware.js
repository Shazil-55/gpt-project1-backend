// controllers/authController.js

// Import required modules and Prisma client
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

// Create a new instance of Prisma client
const prisma = new PrismaClient();

// Auth function
async function auth(req, res, next) {
  try {
    const email = req.body.email;
    console.log("email", email);
    if (email) {
      const user = await prisma.user.findFirst({ where: { email } });
      if (user) {
        const isMatch = await comparePasswords(req.body.password, user.password);
        if (isMatch) {
          req.user = user;
          console.log("isssssssss",isMatch)
          next();
        } else {
        console.log("isssssssss1",isMatch)

          res.status(401).send("Error: No such user/admin exists");
        }
      } else {
        res.status(401).send("Error: No such user/admin exists");
      }
    } else {
      console.log("isssssssss223")
      res.status(401).send("Error: No such user/admin exists");
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Compare passwords function
async function comparePasswords(password, encryptedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    console.log("isMatch", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

// Export the functions to be used in the routes
module.exports = {
  auth,
  comparePasswords,
};
