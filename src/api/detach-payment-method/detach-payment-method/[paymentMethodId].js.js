import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentMethodId } = req.query;
    
    const detached = await stripe.paymentMethods.detach(paymentMethodId);

    res.status(200).json({ 
      success: true,
      message: 'Payment method detached successfully' 
    });
  } catch (error) {
    console.error('Detach payment method error:', error);
    res.status(500).json({ error: error.message });
  }
}