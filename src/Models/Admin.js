// models/Admin.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteUserByEmail(email) {
  try {
    const user = await prisma.user.delete({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

async function updateAdminById(id, updatedAdmin) {
  try {
    const admin = await prisma.user.update({
      where: {
        id: id,
      },
      data: updatedAdmin,
    });
    return admin;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error getting users data:", error);
    throw error;
  }
}

async function getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error("Error retrieving user:", error);
      throw error;
    }
  }


  async function CreateUser(email,password,role) {
    try {
        const user = await prisma.user.create({
            data: {
              email:email,
              password:password,
              role:role, 
            },
          });
          return user;
    } catch (error) {
      console.error("Error retrieving user:", error); 
      throw error;
    }
  }


  // async function CreateUser(email, password, role) {
  //   const userCreateInput = Prisma.validator(UserCreateInput);
  //   console.log("userCreateInput",userCreateInput)
  //   const user = {
  //     email: email,
  //     password: password,
  //     role: role,
  //   };
  
  //   const validatedUser = userCreateInput(user);
  
  //   try {
  //     const createdUser = await prisma.user.create({
  //       data: validatedUser,
  //     });
  //     return createdUser;
  //   } catch (error) {
  //     console.error("Error retrieving user:", error);
  //     throw error;
  //   }
  // }

module.exports = {
    getUserByEmail,
    CreateUser,
  deleteUserByEmail,
  updateAdminById,
  getAllUsers,
};
