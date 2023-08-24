const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const stripe = require('stripe')('sk_test_51NDuT4SA4dNQIbYgzobOtVMEscykgFFXaWwx3xnx7yh9VvlITIZrE6aA6AHS8euJAHDq0QD1OcSRCMgUuTfzCmfG00KIE7mdLg');


async function getEmail(sessionId) {
    try {
      const retrievedSession = await stripe.checkout.sessions.retrieve(sessionId);
      const customerEmail = retrievedSession.customer_details.email;
      console.log("customerEmail", customerEmail);
      return customerEmail;
    } catch (error) {
      console.error('Error retrieving session:', error);
      throw error; // Rethrow the error for the calling function to handle
    }
  }
  


  async function getProductInfo(subscriptionId) {
    try {
      const retrievedSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const productId = retrievedSubscription.items.data[0].price.product;
      const priceId = retrievedSubscription.items.data[0].price.id;
  
      const retrievedProduct = await stripe.products.retrieve(productId);
      const productName = retrievedProduct.name;
      const priceAmount = retrievedSubscription.items.data[0].price.unit_amount / 100; // Convert from cents to dollars
  
      const productInfo = {
        name: productName,
        price: priceAmount
      };
  
      return productInfo;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for the calling function to handle
    }
  }

  
 async  function updateDate(email) {
  const user = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      expiryDate: calculateExpiryDate(),
    },
  });
  }


  function calculateExpiryDate(plan) {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    console.log("===========================================",plan)
    if(plan=="month"){
      console.log("it is month +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month to the current date
    }
    else{
      console.log("it is year ----------------------------------------------------------")

      expiryDate.setMonth(expiryDate.getMonth() + 12); // Add 1 month to the current date
    }
    return expiryDate;
  }


  async function AddSubscription(email , name , plan) {
    try {
      var subId=0;
      if(name==="lifetime")subId=3
      if(name==="Growth Plan")subId=2
      if(name==="Essential Plan")subId=1
      console.log("adding subscription ", subId);
      const user = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          isSubscribed: subId ,
          expiryDate: name !== 'lifetime' ? calculateExpiryDate(plan) : null,
        },
      });
  
      return user;


    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for the calling function to handle
    }
  }





module.exports = {
    getEmail,
    getProductInfo,
    AddSubscription,
    updateDate,
};
