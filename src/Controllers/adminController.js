const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const adminModel = require("../Models/Admin");

// Delete user route handler
async function deleteUser(req, res,next) {
  try {
    
    const email = req.query.email;
    console.log(email);
    const user = await adminModel.deleteUserByEmail(email);
    res.json("Route only accessible by the user");
  } catch (error) {
    console.error("Error deleting user:", error);
    next()
    // res.status(500).send("Internal Server Error");
  }
}


async function addUser(req,res) {
    try {
        const {email,password,role}= req.body;
        const user = {email,password,role}
        console.log("my data = ", email,password,role)
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
  
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
  
      // Hash the password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });
  
      return newUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }  


// Update user route handler
async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedUser = req.body;
    const user = await adminModel.updateAdminById(id, updatedUser);
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get data route handler
async function getData(req, res) {
  try {
    const users = await adminModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Export the functions to be used in the routes
module.exports = {
  deleteUser,
  updateUser,
  getData,
  addUser,
};
