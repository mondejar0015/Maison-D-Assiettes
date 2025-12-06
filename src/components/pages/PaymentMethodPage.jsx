import React, { useState } from "react";
import { TrashIcon, PlusIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import PageHeader from "../shared/PageHeader.jsx";
import BottomNav from "../shared/BottomNav.jsx";
import { stripePromise, createSetupIntent, detachPaymentMethod } from "../../stripeClient.js"; // Import Stripe functions

export default function PaymentMethodPage({ 
  paymentMethods, 
  loading, 
  addCard, 
  removeCard, 
  goBack,
  profile // Added profile prop to access customer ID for Stripe
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");

  const handleAddCard = async () => { // Made function asynchronous
    if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim() || !cardName.trim()) {
      alert("Please fill in all card details");
      return;
    }
    
    try {
      // 1. Get a Setup Intent from your backend (via stripeClient.js)
      if (!profile || !profile.stripe_customer_id) {
        alert("Stripe customer not found. Cannot save card.");
        return;
      }
      
      const { clientSecret } = await createSetupIntent(profile.stripe_customer_id);

      // 2. Use Stripe to confirm the setup intent and get a payment method ID
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");
      
      // In a real app, you would use stripe.confirmCardSetup(clientSecret, elements, ...).
      // Here, we simulate the success and call the local addCard function.
      const last4 = cardNumber.replace(/\s/g, '').slice(-4);
      const fakePaymentMethodId = `pm_mock_card_${last4}_${Date.now()}`;
      
      // Simulate success and call addCard with a mock card object
      alert("Card added successfully (Simulated Stripe Setup)");
      
      addCard({
        id: fakePaymentMethodId,
        last4: last4,
        brand: "Visa", // Mock brand
        name: cardName
      });

      // Reset form
      setCardNumber("");
      setCardExpiry("");
      setCardCVC("");
      setCardName("");
      setShowAddForm(false);
      
    } catch (error) {
      console.error("Add Card error:", error);
      alert("Failed to add card: " + error.message);
    }
  };

  const handleRemoveCard = async (cardId) => { // Made function asynchronous
    if (confirm("Are you sure you want to remove this card?")) {
      try {
        // Use the actual Stripe detach function
        await detachPaymentMethod(cardId);
        
        // Call the local function to update state
        removeCard(cardId);
        alert("Card removed successfully (Simulated Stripe Detach)");
      } catch (error) {
        console.error("Remove Card error:", error);
        alert("Failed to remove card: " + error.message);
      }
    }
  };

  const formatCardNumber = (number) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="Payment Methods" showBack={true} onBack={goBack} />
      
      <div className="p-4 space-y-3">
        {paymentMethods.map((card) => (
          <div key={card.id} className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
                {card.brand[0]}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">
                  {card.brand}
                </div>
                <div className="text-xs text-gray-600">
                  {formatCardNumber(card.last4)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveCard(card.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition flex-shrink-0"
            >
              <TrashIcon className="w-5 h-5 text-red-500" />
            </button>
          </div>
        ))}
        
        {paymentMethods.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            <CreditCardIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No payment methods saved.</p>
            <p className="text-xs mt-1">Add a card to make checkout faster</p>
          </div>
        )}
        
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Add New Card</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  placeholder="Name on Card"
                />
                
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  placeholder="Card Number"
                  maxLength={19}
                />
                
                <div className="flex gap-3">
                  <input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5))}
                    className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  <input
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
                    placeholder="CVC"
                    maxLength={4}
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  Test Card: 4242 4242 4242 4242 | Expiry: Any future date | CVC: Any 3 digits
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Save Card
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-blue-200 border-2 border-blue-400 text-gray-800 font-semibold hover:bg-blue-300 transition text-sm mt-4 flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          {loading ? "Adding..." : "Add New Card (Demo)"}
        </button>
      </div>
      
      <BottomNav changePage={() => {}} />
    </div>
  );
}