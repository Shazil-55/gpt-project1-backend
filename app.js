const stripe = require('stripe')('sk_test_51NDuT4SA4dNQIbYgzobOtVMEscykgFFXaWwx3xnx7yh9VvlITIZrE6aA6AHS8euJAHDq0QD1OcSRCMgUuTfzCmfG00KIE7mdLg');
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const adminRoutes = require("./src/Routes/adminRoutes");
const stripeRoutes = require("./src/Routes/stripeRoutes");
const userRoutes = require("./src/Routes/userRoutes");  
// const {auth} = require('./src/MiddleWare/authMiddleware')
const errorHandler = require("./src/MiddleWare/errorHandler");



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/stripe-webhook", stripeRoutes);
app.use(errorHandler);
 

// app.post('/stripe-webhook', (req, res) => {
//   const event = req.body;
//   console.log("Received Stripe event:", event.type);

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     const sessionId = session.id;
//     console.log("Received completed session ID:", sessionId);

//     // You can store the sessionId in your database or take any other necessary actions
//   }

//   if (event.type === 'checkout.session.completed') {
//     const paymentIntent = event.data.object;
//     const subscriptionId = paymentIntent.subscription;
//     console.log("paymentIntent",paymentIntent)
//     if (subscriptionId) {
//       // This is a successful payment for a subscription
//       console.log("Successful payment for subscription:", subscriptionId);
//       // Store subscriptionId in your database
//       // Your database insertion logic here
//     } else {
//       // This is a successful one-time payment
//       console.log("Successful one-time payment");
//     }
//   }

//   res.status(200).send();
// });



 
app.listen(5000, () => {
  console.log("i am listening");
});

