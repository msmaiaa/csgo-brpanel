const config = require("../config/config.json")
const stripe = require('stripe')(config.payment_gateways.stripe.api_key);
const YOUR_DOMAIN = 'http://' + config.hostname + ':3535';
const SUCCESS_CALLBACK_URL = `${YOUR_DOMAIN}`
const CANCEL_CALLBACK_URL = `${YOUR_DOMAIN}`

const endpointSecret = config.payment_gateways.stripe.webhook_secret

exports.initStripePayment = async(req, res) => {
  try{
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // TODO: replace this with the `price` of the product you want to sell
          price: 'price_1JR6VUGt95CU1XW7vjBxmnDU',
          quantity: 1,
        },
      ],
      payment_method_types: [
        'boleto',
        'card',
      ],
      mode: 'payment',
      locale: 'pt-BR',
      success_url: SUCCESS_CALLBACK_URL,
      cancel_url: CANCEL_CALLBACK_URL,
    });
    res.redirect(303, session.url)
  }catch(e) {
    console.error(e)
  }
}

const fulfillOrder = (session) => {
  // TODO: fill me in
  console.log("Fulfilling order");
}

const createOrder = (session) => {
  // TODO: fill me in
  console.log("Creating order");
}

const emailCustomerAboutFailedPayment = (session) => {
  // TODO: fill me in
  console.log("Emailing customer");
}


exports.handleStripeWebhook = async(req, res) => {
  try{
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Save an order in your database, marked as 'awaiting payment'
        createOrder(session);
  
        // Check if the order is paid (e.g., from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === 'paid') {
          fulfillOrder(session);
        }
  
        break;
      }
  
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
  
        // Fulfill the purchase...
        fulfillOrder(session);
  
        break;
      }
  
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
  
        // Send an email to the customer asking them to retry their order
        emailCustomerAboutFailedPayment(session);
  
        break;
      }
    }
    
    //  Return a response to acknowledge receipt of the event
    return res.status(200).json({received: true})
  }catch(e) {
    console.error(e)
  }
}