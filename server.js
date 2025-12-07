// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
import Stripe from 'stripe';

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
app.post('/api/payment-intent', async (req, res) => {
  try {
    // Expect amount in cents or integer; keep behavior consistent with Vercel API files
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Setup Intent for saving cards
app.post('/api/setup-intent', async (req, res) => {
  try {
    const { customerId } = req.body;

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    });
  } catch (error) {
    console.error('Setup intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Customer
app.post('/api/customer', async (req, res) => {
  try {
    const { email, name } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {}
    });

    res.json({
      customerId: customer.id
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Customer Payment Methods
app.get('/api/customer-payment-methods/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    res.json(paymentMethods.data);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Detach Payment Method
app.post('/api/detach-payment-method/:paymentMethodId', async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

    res.json({ success: true });
  } catch (error) {
    console.error('Detach payment method error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId } = req.query;
    
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    res.status(200).json(paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      exp_month: pm.card.exp_month,
      exp_year: pm.card.exp_year,
    })));
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: error.message });
  }
}