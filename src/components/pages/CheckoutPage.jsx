import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";
import PageHeader from "../shared/PageHeader.jsx";

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
  
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = cart.length ? 150 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;
  
  async function handlePlaceOrder() {
    if (!address.trim()) {
      alert("Please enter your shipping address");
      return;
    }
    
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: profile.id,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          status: "processing",
          shipping_address: { address: address },
          payment_method: paymentMethod,
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
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank">Bank Transfer</option>
          </select>
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