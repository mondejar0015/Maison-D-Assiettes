import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";
import PageHeader from "../shared/PageHeader.jsx";
import { stripePromise } from "../../stripeClient.js"; // IMPORTED STRIPE

export default function CheckoutPage({ 
  cart, 
  profile, 
  formatCurrency, 
  changePage, 
  goBack, 
  loading,
  setCart,
  setOrders
}) {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notes, setNotes] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");
  
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = cart.length ? 150 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  // Uses stripePromise for a better demonstration of intent, even if simulated
  const processCardPayment = async () => {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error("Stripe is not loaded.");
    }
    // Simulate successful payment intent creation (Replace with actual Stripe confirmPayment/confirmCardPayment call)
    return { 
      success: true, 
      paymentIntentId: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  };
  
  async function handlePlaceOrder() {
    if (!address.trim()) {
      alert("Please enter your shipping address");
      return;
    }
    
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    if (paymentMethod === "card") {
      // Basic validation for demo
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim() || !cardName.trim()) {
        alert("Please fill in all card details");
        return;
      }
      
      if (cardNumber.replace(/\s/g, '').length < 16) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
    }
    
    try {
      let paymentIntentId = null;
      let initialStatus;

      if (paymentMethod === "card") {
        // Step 1: Process Payment
        const paymentResult = await processCardPayment();
        if (!paymentResult.success) {
          alert("Payment failed. Please try again.");
          return;
        }
        paymentIntentId = paymentResult.paymentIntentId;
        // Status must be an allowed value: Use 'confirmed' for successful payment
        initialStatus = "confirmed";
      } else {
        // Status must be an allowed value: Use 'processing' for pending payment (COD/Bank)
        initialStatus = "processing";
      }
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: profile.id,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: initialStatus, // Use the determined, allowed status
          shipping_address: { address: address },
          payment_method: paymentMethod,
          payment_intent_id: paymentIntentId,
          notes: notes
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        item_id: item.id,
        qty: item.qty,
        unit_price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart
      const { error: cartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", profile.id);
      
      if (cartError) throw cartError;
      
      // Update local state
      setCart([]);
      setOrders(prev => [orderData, ...prev]);
      
      // Show success message
      alert(`Order placed successfully! Order #${orderData.id}`);
      
      // Redirect to home
      changePage("home");
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error placing order: " + error.message);
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Checkout" showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="font-bold text-gray-800 mb-3 text-sm">
            Order Summary
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipping Address */}
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="font-bold text-gray-800 mb-3 text-sm">
            Shipping Address
          </div>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400"
            placeholder="Enter your complete shipping address"
            rows="3"
            required
          />
        </div>
        
        {/* Payment Method */}
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="font-bold text-gray-800 mb-3 text-sm">
            Payment Method
          </div>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-white mb-4"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank">Bank Transfer</option>
          </select>

          {paymentMethod === "card" && (
            <div className="space-y-3">
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                placeholder="Name on Card"
                required
              />
              
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                placeholder="Card Number"
                maxLength={19}
                required
              />
              
              <div className="flex gap-3">
                <input
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5))}
                  className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
                <input
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  placeholder="CVC"
                  maxLength={4}
                  required
                />
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Test Card: 4242 4242 4242 4242 | Expiry: Any future date | CVC: Any 3 digits
              </div>
            </div>
          )}
        </div>
        
        {/* Notes */}
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="font-bold text-gray-800 mb-3 text-sm">
            Additional Notes
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400"
            placeholder="Any special instructions for your order"
            rows="2"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0 || !address.trim()}
            className="flex-1 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : `Place Order • ${formatCurrency(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}