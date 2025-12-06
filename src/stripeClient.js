import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// API base URL - automatically handles Vercel deployment
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

// Create payment intent
export async function createPaymentIntent(amount) {
  try {
    const response = await fetch(`${API_BASE_URL}/payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return await response.json();
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw error;
  }
}

// Create setup intent for saving cards
export async function createSetupIntent(customerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/setup-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId })
    });
    return await response.json();
  } catch (error) {
    console.error('Create setup intent error:', error);
    throw error;
  }
}

// Create customer
export async function createCustomer(email, name) {
  try {
    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    return await response.json();
  } catch (error) {
    console.error('Create customer error:', error);
    throw error;
  }
}

// Get customer payment methods
export async function getCustomerPaymentMethods(customerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/customer-payment-methods/${customerId}`);
    return await response.json();
  } catch (error) {
    console.error('Get payment methods error:', error);
    throw error;
  }
}

// Detach payment method
export async function detachPaymentMethod(paymentMethodId) {
  try {
    const response = await fetch(`${API_BASE_URL}/detach-payment-method/${paymentMethodId}`, {
      method: 'POST'
    });
    return await response.json();
  } catch (error) {
    console.error('Detach payment method error:', error);
    throw error;
  }
}