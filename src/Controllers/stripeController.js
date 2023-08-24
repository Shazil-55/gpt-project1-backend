const stripe = require('stripe')('sk_test_51NDuT4SA4dNQIbYgzobOtVMEscykgFFXaWwx3xnx7yh9VvlITIZrE6aA6AHS8euJAHDq0QD1OcSRCMgUuTfzCmfG00KIE7mdLg');

const stripeModel = require("../Models/Stripe");


// Get data route handler
 async function validateRequest(req, res,next) {
    try {
        const event = req.body;
        var plan=""
        if (event.type === 'customer.subscription.created') {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const startDate = subscription.start_date; // Subscription start date
            const planId = subscription.items.data[0].plan.id; // ID of the subscription plan
          
            // Retrieve the subscription plan to check the interval
             plan = await stripe.plans.retrieve(planId);
           console.log("plannnnnnnnnnnnn",plan.interval)
           plan= plan.interval;

            // Retrieve the customer's details using the customer ID
            const customer = await stripe.customers.retrieve(customerId);
            const customerEmail = customer.email;  
        
        }

        var billingReason;
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          const sessionId = session.id;
          const email = await stripeModel.getEmail(sessionId);
          console.log("this email is", email);  
          var purchase ="";
          var plan2;
          const subscriptionId = session.subscription;
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const subscriptionItem = subscription.items.data[0]; // Assuming only one item
            
            const planId = subscriptionItem.plan.id;
             plan2 = await stripe.plans.retrieve(planId);
            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<" , plan2)



            console.log("subscription",session)
             purchase = await stripeModel.getProductInfo(subscriptionId);   
             console.log("this purchase is", purchase);  
          } else {
           purchase = {name:"lifetime",price:30};
          }

          const UserSubscription = await stripeModel.AddSubscription(email , purchase.name , plan2.interval);

          console.log("=>",email,purchase);
          billingReason = session.mode;
        }         
        if(event.type === 'invoice.payment_succeeded'){
            const customerId = event.data.object.customer;
            const customer = await stripe.customers.retrieve(customerId);
            // console.log('Customer Information:', customer.email);
            const customerEmail = customer.email;
            // ab is info ko use kar ke hum database mein usko update kar dein gaey 
            if (billingReason === 'subscription') {
              // This logic will only run for subscription renewals
              const updateDate = await stripe.updateDate(customerEmail)
              console.log("User has renewed their subscription");
            } else {
              console.log("Payment for other invoice"); 
            }
            // console.log("user has bought a new subscription")
        }



  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Export the functions to be used in the routes
module.exports = {
    validateRequest
};
