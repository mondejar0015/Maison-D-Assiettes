import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";

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
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = cart.length ? 150 : 0;
  const total = subtotal + shipping;
  
  const [fullName, setFullName] = useState(profile?.display_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  async function handlePlaceOrder() {
    if (!profile || cart.length === 0) return;
    
    if(!fullName || !email || !street || !city || !zip || !cardNumber) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: profile.id,
          subtotal,
          shipping,
          total,
          status: "processing",
        })
        .select()
        .single();
      
      if (orderError) throw orderError;

      const orderItemsPayload = cart.map(item => ({
        order_id: orderData.id,
        item_id: item.id,
        qty: item.qty,
        unit_price: item.price
      }));
      
      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
      if (itemsError) throw itemsError;
      
      // Clear cart
      const { error: clearCartError } = await supabase.from('cart_items').delete().eq('user_id', profile.id);
      if (clearCartError) console.error("Clear cart error:", clearCartError);
      
      // Update local state
      setCart([]);
      setOrders(prev => [orderData, ...prev]);
      
      // Show success and go home
      alert("Order placed successfully!");
      changePage("home");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Check Out" showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-4 pb-20">
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="font-bold text-gray-800 mb-2 text-sm">Order Summary</div>
          <div className="text-xs text-gray-600 mb-3">{cart.length} items</div>
          
          <div className="mt-2 space-y-1.5">
            {cart.map((c) => (
              <div key={c.cart_item_id} className="flex justify-between text-xs text-gray-700">
                <div className="truncate flex-1">
                  {c.title} x{c.qty}
                </div>
                <div className="flex-shrink-0 font-medium">
                  {formatCurrency(c.price * c.qty)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-3 text-sm text-gray-600 pb-3 border-b border-gray-200">
            <div>Shipping Fee</div>
            <div className="font-medium">{formatCurrency(shipping)}</div>
          </div>
          
          <div className="flex justify-between font-bold text-gray-800 mt-3 text-base">
            <div>Total</div>
            <div>{formatCurrency(total)}</div>
          </div>
        </div>
        
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
          <div className="font-bold text-gray-800 mb-3 text-sm">Shipping & Payment</div>
          
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Full Name*"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Email*"
            type="email"
          />
          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Street Address*"
          />
          
          <div className="flex gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
              placeholder="City*"
            />
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-28 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
              placeholder="Zip Code*"
            />
          </div>
          
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Card Number*"
          />
        </div>
        
        <div className="mt-6 flex gap-2">
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
            disabled={loading || cart.length === 0}
            className="flex-1 py-2.5 rounded-full bg-blue-200 border-2 border-blue-400 text-gray-800 font-semibold hover:bg-blue-300 transition text-sm"
          >
            {loading ? "Placing Order..." : "Confirm"}
          </button>
        </div>
      </div>
      
      <BottomNav changePage={changePage} />
    </div>
  );
}