import React, { useEffect, useState } from "react";
import { supabase, testConnection } from "./supabaseClient.js";
import PageRouter from "./components/PageRouter.jsx";
import LoadingOverlay from "./components/layout/LoadingOverlay.jsx";
import "./App.css";

// --- PREDEFINED DATA LISTS (PLATE SPECIFIC) ---
export const ITEM_TYPES = [
  "Dinner Plate", 
  "Salad Plate", 
  "Dessert Plate", 
  "Soup Bowl", 
  "Pasta Bowl",
  "Charger Plate", 
  "Serving Platter", 
  "Saucer", 
  "Teacup & Saucer Set", 
  "Appetizer Plate", 
  "Decorative Plate",
  "Complete Set"
];

export const ITEM_ORIGINS = [
  "French (Limoges)", 
  "English (Staffordshire)", 
  "Italian (Majolica)", 
  "Chinese (Export)", 
  "Japanese (Imari/Kutani)", 
  "American", 
  "German (Meissen)", 
  "Dutch (Delft)", 
  "Scandinavian", 
  "Unknown", 
  "Other"
];

export const ITEM_ERAS = [
  1700, 1750, 1800, 1850, 1900, 1910, 1920, 1930, 
  1940, 1950, 1960, 1970, 1980, 1990, 2000
];

export const ITEM_MATERIALS = [
  "Porcelain", 
  "Bone China", 
  "Stoneware", 
  "Earthenware", 
  "Ironstone", 
  "Creamware",
  "Faience", 
  "Terracotta", 
  "Glass", 
  "Ceramic", 
  "Majolica", 
  "Pewter",
  "Silver Plated",
  "Unknown"
];

export default function App() {
  const [currentPage, setCurrentPage] = useState("loading"); // Start with loading
  const [historyStack, setHistoryStack] = useState([]);
  
  // Auth state
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isSellerView = profile?.is_seller || false;

  // Data states
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [sellerItems, setSellerItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteTab, setFavoriteTab] = useState("items");
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Initialize app
  useEffect(() => {
    console.log("🚀 App initializing...");
    
    // Small delay to show loading screen
    const timer = setTimeout(() => {
      console.log("⏱️ Loading screen timeout - moving to starting page");
      if (authLoading) {
        setCurrentPage("starting");
      }
    }, 1500);

    // Check auth state
    checkAuthStatus();

    return () => clearTimeout(timer);
  }, []);

  // Auth listener
  useEffect(() => {
    console.log("🔄 Setting up auth listener...");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("📡 Auth state changed:", _event);
        setSession(session);
        
        if (session?.user) {
          console.log("✅ User logged in, fetching profile...");
          await fetchProfile(session.user.id);
        } else {
          console.log("🚫 No user, going to login");
          setProfile(null);
          setAuthLoading(false);
          if (currentPage === "loading") {
            setCurrentPage("starting");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [currentPage]);

  // Check initial auth status
  async function checkAuthStatus() {
    try {
      console.log("🔍 Checking initial auth status...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("📱 Initial session:", session ? "Found" : "None");
      
      setSession(session);
      
      if (session?.user) {
        console.log("👤 User found, fetching profile...");
        await fetchProfile(session.user.id);
      } else {
        console.log("👤 No user found, going to starting page");
        setAuthLoading(false);
        // Move to starting page after a brief delay
        setTimeout(() => {
          setCurrentPage("starting");
        }, 500);
      }
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      setAuthLoading(false);
      setCurrentPage("starting");
    }
  }

  // Test connection
  useEffect(() => {
    if (!authLoading && currentPage !== "loading") {
      testConnection();
    }
  }, [authLoading, currentPage]);

  // Data fetching based on profile
  useEffect(() => {
    if (profile) {
      console.log("📦 Fetching data for user:", profile.id);
      fetchItems();
      fetchCart();
      fetchFavorites();
      fetchOrders();
      fetchNotifications();
      fetchPaymentMethods();
      if (profile.is_seller) {
        fetchSellerItems();
      }
    }
  }, [profile]);

  async function fetchProfile(userId) {
    console.log("👤 Fetching profile for:", userId);
    setAuthLoading(true);
    
    try {
      // Try to get existing profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("fetchProfile error", error);
        setAuthLoading(false);
        setCurrentPage("login");
        return;
      }

      if (data) {
        console.log("✅ Found existing profile");
        setProfile(data);
        setAuthLoading(false);
        setCurrentPage("home");
        return;
      }

      // Create new profile
      console.log("📝 Creating new profile...");
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (!user) {
        console.error("No user found");
        setAuthLoading(false);
        setCurrentPage("login");
        return;
      }

      const { data: created, error: insertErr } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          display_name: user.user_metadata?.display_name || "New User",
          email: user.email || null,
          is_seller: user.user_metadata?.is_seller || false,
        })
        .select()
        .single();

      if (insertErr) {
        console.error("create profile error", insertErr);
        setAuthLoading(false);
        setCurrentPage("login");
        return;
      }

      console.log("✅ Created new profile");
      setProfile(created);
      setAuthLoading(false);
      setCurrentPage("home");
    } catch (err) {
      console.error("Unexpected error in fetchProfile", err);
      setAuthLoading(false);
      setCurrentPage("login");
    }
  }

  async function fetchItems() {
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("fetchItems error", error);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  }

  async function fetchCart() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, qty, items(*)")
        .eq("user_id", profile.id);
      
      if (error) throw error;
      
      const remappedCart = (data || []).map((ci) => ({
        ...ci.items,
        qty: ci.qty,
        cart_item_id: ci.id,
      }));
      setCart(remappedCart);
    } catch (error) {
      console.error("fetchCart error", error);
      setCart([]);
    }
  }

  async function fetchFavorites() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, items(*)")
        .eq("user_id", profile.id);
      
      if (error) throw error;
      
      const favItems = (data || []).map((f) => ({
        ...f.items,
        favorite_id: f.id,
      }));
      setFavorites(favItems);
    } catch (error) {
      console.error("fetchFavorites error", error);
      setFavorites([]);
    }
  }

  async function fetchOrders() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", profile.id)
        .order("placed_at", { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("fetchOrders error", error);
      setOrders([]);
    }
  }

  async function fetchNotifications() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("fetchNotifications error", error);
      setNotifications([]);
    }
  }

  async function fetchPaymentMethods() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", profile.id);
      
      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error("fetchPaymentMethods error", error);
      setPaymentMethods([]);
    }
  }

  async function fetchSellerItems() {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from("seller_items")
        .select("id, items(*)")
        .eq("seller_id", profile.id);
      
      if (error) throw error;
      
      const myItems = (data || []).map((si) => ({
        ...si.items,
        seller_item_id: si.id,
      }));
      setSellerItems(myItems);
    } catch (error) {
      console.error("fetchSellerItems error", error);
      setSellerItems([]);
    }
  }

  function formatCurrency(n) {
    return "$ " + Number(n).toLocaleString();
  }

  function pushToHistory(page) {
    setHistoryStack((h) => [...h, page]);
  }

  function changePage(page) {
    console.log("🌐 Changing page to:", page);
    setHistoryStack((h) => [...h, currentPage]);
    setCurrentPage(page);
  }

  function goBack() {
    setHistoryStack((h) => {
      if (h.length === 0) {
        setCurrentPage("home");
        return [];
      }
      const next = [...h];
      const prev = next.pop();
      setCurrentPage(prev || "home");
      return next;
    });
  }

  async function addToCart(item) {
    if (!profile) {
      alert("Please log in to add items to your cart.");
      changePage("login");
      return;
    }
    
    setLoading(true);
    try {
      const found = cart.find((x) => x.id === item.id);
      
      if (found) {
        const { error } = await supabase
          .from("cart_items")
          .update({ qty: found.qty + 1 })
          .match({ user_id: profile.id, item_id: item.id });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: profile.id,
          item_id: item.id,
          qty: 1,
        });
        if (error) throw error;
      }
      
      // Refresh cart
      await fetchCart();
    } catch (error) {
      console.error("addToCart error", error);
      alert("Error adding to cart: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(item_id) {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .match({ user_id: profile.id, item_id: item_id });
      
      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error("removeFromCart error", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCartQty(item_id, newQty) {
    if (!profile || newQty < 1) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ qty: newQty })
        .match({ user_id: profile.id, item_id: item_id });
      
      if (error) throw error;
      await fetchCart();
    } catch (error) {
      console.error("updateCartQty error", error);
    } finally {
      setLoading(false);
    }
  }

  async function addNewItem({ title, price, img, type, origin, era, material }) {
    if (!profile) {
      alert("You must be logged in to add an item.");
      return null;
    }
    
    setLoading(true);
    try {
      const payload = {
        title: title || "Untitled",
        price: Number(price) || 0,
        img: img || "/images/placeholder.png",
        type: type || "Unknown",
        origin: origin || "Unknown",
        era: era ? Number(era) : new Date().getFullYear(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .insert(payload)
        .select()
        .single();

      if (itemError) throw itemError;

      const { error: sellerError } = await supabase.from("seller_items").insert({
        seller_id: profile.id,
        item_id: itemData.id,
      });
      
      if (sellerError) throw sellerError;

      // Refresh data
      await fetchItems();
      await fetchSellerItems();
      
      return itemData;
    } catch (error) {
      console.error("addNewItem error", error);
      alert("Error adding item: " + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    const isSeller = sellerItems.find((it) => it.id === id);
    if (!isSeller) {
      alert("You do not have permission to delete this item.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
      
      // Refresh data
      await fetchItems();
      await fetchSellerItems();
    } catch (error) {
      console.error("deleteItem error", error);
      alert("Error deleting item: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(item) {
    if (!profile) {
      alert("Please log in to favorite items.");
      changePage("login");
      return;
    }
    
    setLoading(true);
    try {
      const exists = favorites.find((f) => f.id === item.id);
      
      if (exists) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .match({ user_id: profile.id, item_id: item.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: profile.id, item_id: item.id });
        if (error) throw error;
      }
      
      await fetchFavorites();
    } catch (error) {
      console.error("toggleFavorite error", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setCart([]);
      setFavorites([]);
      setOrders([]);
      setNotifications([]);
      setPaymentMethods([]);
      setSellerItems([]);
      setCurrentPage("login"); // Go to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }
  
  async function addCard() {
    if (!profile) return;
    
    setLoading(true);
    try {
      const brands = ["Visa", "Mastercard", "Amex"];
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];
      const randomLast4 = Math.floor(1000 + Math.random() * 9000).toString();
      
      const { error } = await supabase.from("payment_methods").insert({
        user_id: profile.id,
        brand: randomBrand,
        last4: randomLast4,
      });
      
      if (error) throw error;
      await fetchPaymentMethods();
    } catch (error) {
      console.error("addCard error", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeCard(id) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      await fetchPaymentMethods();
    } catch (error) {
      console.error("removeCard error", error);
    } finally {
      setLoading(false);
    }
  }

  async function markNotificationAsRead(id) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      
      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error("markNotificationAsRead error", error);
    }
  }

  async function becomeSeller() {
    if (!profile) return;
    
    if (!confirm("Are you sure you want to open a seller account?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_seller: true })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      setProfile(p => ({...p, is_seller: true}));
      alert("Congratulations! You are now a seller. You can start listing items.");
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      {/* Debug info - remove in production */}
      <div className="fixed top-2 left-2 z-50 bg-black/80 text-white text-xs p-2 rounded opacity-70">
        Page: {currentPage} | Auth: {authLoading ? "Loading..." : "Ready"} | User: {profile ? profile.display_name : "None"}
      </div>
      
      <PageRouter
        currentPage={currentPage}
        authLoading={authLoading}
        loading={loading}
        loadingItems={loadingItems}
        profile={profile}
        isSellerView={isSellerView}
        items={items}
        cart={cart}
        setCart={setCart}
        favorites={favorites}
        orders={orders}
        setOrders={setOrders}
        notifications={notifications}
        paymentMethods={paymentMethods}
        sellerItems={sellerItems}
        favoriteTab={favoriteTab}
        formatCurrency={formatCurrency}
        changePage={changePage}
        goBack={goBack}
        handleLogout={handleLogout}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartQty={updateCartQty}
        toggleFavorite={toggleFavorite}
        addNewItem={addNewItem}
        deleteItem={deleteItem}
        addCard={addCard}
        removeCard={removeCard}
        markNotificationAsRead={markNotificationAsRead}
        setFavoriteTab={setFavoriteTab}
        becomeSeller={becomeSeller}
      />
      
      <LoadingOverlay loading={loading} />
    </div>
  );
}