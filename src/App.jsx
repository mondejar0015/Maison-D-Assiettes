import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient.js";
import PageRouter from "./components/PageRouter.jsx";
import LoadingOverlay from "./components/LoadingOverlay.jsx";
import "./App.css";

// --- PREDEFINED DATA LISTS ---
export const ITEM_TYPES = [
  "Dinner Plate", "Salad Plate", "Dessert Plate", "Soup Bowl", "Pasta Bowl",
  "Charger Plate", "Serving Platter", "Saucer", "Teacup & Saucer Set", 
  "Appetizer Plate", "Decorative Plate", "Complete Set"
];

export const ITEM_ORIGINS = [
  "French (Limoges)", "English (Staffordshire)", "Italian (Majolica)", 
  "Chinese (Export)", "Japanese (Imari/Kutani)", "American", "German (Meissen)", 
  "Dutch (Delft)", "Scandinavian", "Unknown", "Other"
];

export const ITEM_ERAS = [
  1700, 1750, 1800, 1850, 1900, 1910, 1920, 1930, 
  1940, 1950, 1960, 1970, 1980, 1990, 2000
];

export const ITEM_MATERIALS = [
  "Porcelain", "Bone China", "Stoneware", "Earthenware", "Ironstone", 
  "Creamware", "Faience", "Terracotta", "Glass", "Ceramic", "Majolica", 
  "Pewter", "Silver Plated", "Unknown"
];

export default function App() {
  const [currentPage, setCurrentPage] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data states
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteTab, setFavoriteTab] = useState("items");
  const [loadingItems, setLoadingItems] = useState(false);

  // Define goBack function with useCallback to prevent re-renders
  const goBack = useCallback(() => {
    if (isAdmin) {
      setCurrentPage("adminDashboard");
    } else {
      setCurrentPage("home");
    }
  }, [isAdmin]);

  // SIMPLIFIED: Check auth once on mount
  useEffect(() => {
    console.log("🚀 App mounting...");
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session ? "Found" : "None");
        
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          console.log("No user, going to starting page");
          setCurrentPage("starting");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setCurrentPage("starting");
      }
    };

    checkAuth();
  }, []);

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          console.log("User logged out");
          setProfile(null);
          setIsAdmin(false);
          setCart([]);
          setFavorites([]);
          setOrders([]);
          setNotifications([]);
          setPaymentMethods([]);
          setCurrentPage("login"); // Changed to go to login page
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    console.log("Loading profile for:", userId);
    
    try {
      // Get profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Profile error:", error);
        await createProfile(userId);
        return;
      }

      if (data) {
        console.log("Profile found:", data);
        setProfile(data);
        setIsAdmin(data.role === "admin");
        
        // Load user data
        await loadUserData(userId);
        
        // Redirect
        if (data.role === "admin") {
          setCurrentPage("adminDashboard");
        } else {
          setCurrentPage("home");
        }
      } else {
        await createProfile(userId);
      }
    } catch (err) {
      console.error("Load profile error:", err);
      setCurrentPage("starting");
    }
  }

  async function createProfile(userId) {
    console.log("Creating profile for:", userId);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (!user) {
        setCurrentPage("starting");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || "New User",
          email: user.email || null,
          role: 'customer',
        })
        .select()
        .single();

      if (error) {
        console.error("Create profile error:", error);
        setCurrentPage("starting");
        return;
      }

      console.log("Profile created:", data);
      setProfile(data);
      setIsAdmin(false);
      setCurrentPage("home");
      await loadUserData(userId);
    } catch (err) {
      console.error("Create profile exception:", err);
      setCurrentPage("starting");
    }
  }

  async function loadUserData(userId) {
    console.log("Loading user data for:", userId);
    
    // Load items
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Load items error:", error);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
    
    // Load cart
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, qty, items(*)")
        .eq("user_id", userId);
      
      if (error) throw error;
      
      const remappedCart = (data || []).map((ci) => ({
        ...ci.items,
        qty: ci.qty,
        cart_item_id: ci.id,
      }));
      setCart(remappedCart);
    } catch (error) {
      console.error("Load cart error:", error);
      setCart([]);
    }
    
    // Load favorites
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, items(*)")
        .eq("user_id", userId);
      
      if (!error && data) {
        const favItems = data.map((f) => ({
          ...f.items,
          favorite_id: f.id,
        }));
        setFavorites(favItems);
      }
    } catch (error) {
      console.error("Load favorites error:", error);
      setFavorites([]);
    }
    
    // Load orders (for history page)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("placed_at", { ascending: false });
      
      if (!error && data) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Load orders error:", error);
      setOrders([]);
    }
  }

  // Format currency
  function formatCurrency(n) {
    return "$ " + Number(n).toLocaleString();
  }

  // Navigation
  function changePage(page) {
    console.log("Changing page to:", page);
    setCurrentPage(page);
  }

  // Cart functions
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
        await supabase
          .from("cart_items")
          .update({ qty: found.qty + 1 })
          .match({ user_id: profile.id, item_id: item.id });
      } else {
        await supabase.from("cart_items").insert({
          user_id: profile.id,
          item_id: item.id,
          qty: 1,
        });
      }
      
      // Reload cart
      await loadUserData(profile.id);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(item_id) {
    if (!profile) return;
    
    setLoading(true);
    try {
      await supabase
        .from("cart_items")
        .delete()
        .match({ user_id: profile.id, item_id: item_id });
      
      await loadUserData(profile.id);
    } catch (error) {
      console.error("Remove from cart error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateCartQty(item_id, newQty) {
    if (!profile || newQty < 1) return;
    
    setLoading(true);
    try {
      await supabase
        .from("cart_items")
        .update({ qty: newQty })
        .match({ user_id: profile.id, item_id: item_id });
      
      await loadUserData(profile.id);
    } catch (error) {
      console.error("Update cart qty error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Favorites
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
        await supabase
          .from("favorites")
          .delete()
          .match({ user_id: profile.id, item_id: item.id });
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: profile.id, item_id: item.id });
      }
      
      // Reload favorites
      const { data, error } = await supabase
        .from("favorites")
        .select("id, items(*)")
        .eq("user_id", profile.id);
      
      if (!error && data) {
        const favItems = data.map((f) => ({
          ...f.items,
          favorite_id: f.id,
        }));
        setFavorites(favItems);
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper function to upload image to Supabase Storage
  async function uploadImageToStorage(file, itemId) {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${itemId}_${Date.now()}.${fileExt}`;
    const filePath = `item-images/${fileName}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('item-images') // Make sure you have this bucket in Supabase Storage
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  }

  // Admin functions - FIXED
  async function addNewItem(itemData) {
    if (!profile || !isAdmin) {
      alert("Admin access required");
      return false;
    }
    
    setLoading(true);
    try {
      // First, create the item without image to get an ID
      const { data: newItem, error: createError } = await supabase
        .from("items")
        .insert({
          title: itemData.title,
          price: itemData.price,
          img: "/images/placeholder.png", // Default placeholder
          type: itemData.type,
          origin: itemData.origin,
          material: itemData.material,
          era: itemData.era,
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      // If there's an image file, upload it
      let imageUrl = "/images/placeholder.png";
      if (itemData.imageFile && newItem.id) {
        const uploadedUrl = await uploadImageToStorage(itemData.imageFile, newItem.id);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          
          // Update the item with the new image URL
          const { error: updateError } = await supabase
            .from("items")
            .update({ img: imageUrl })
            .eq("id", newItem.id);
          
          if (updateError) {
            console.error("Update image error:", updateError);
          }
        }
      }
      
      // Refresh items
      const { data: newItems } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: false });
      
      setItems(newItems || []);
      return true;
    } catch (error) {
      console.error("Add new item error:", error);
      alert("Error adding item: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(itemId) {
    if (!profile || !isAdmin) {
      alert("Admin access required");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId);
      
      if (error) throw error;
      
      // Refresh items
      const { data: newItems } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: false });
      
      setItems(newItems || []);
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Delete item error:", error);
      alert("Error deleting item");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllOrders() {
    if (!isAdmin) return [];
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("placed_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Fetch all orders error:", error);
      return [];
    }
  }

  async function fetchAllUsers() {
    if (!isAdmin) return [];
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Fetch all users error:", error);
      return [];
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    if (!profile || !isAdmin) {
      alert("Admin access required");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      
      if (error) throw error;
      alert(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update order status error:", error);
      alert("Error updating order status");
    }
  }

  async function updateUserRole(userId, newRole) {
    if (!profile || !isAdmin) {
      alert("Admin access required");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);
      
      if (error) throw error;
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Update user role error:", error);
      alert("Error updating user role");
    }
  }

  // Logout - Fixed to go to login page
  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAdmin(false);
      setCart([]);
      setFavorites([]);
      setOrders([]);
      setNotifications([]);
      setPaymentMethods([]);
      setCurrentPage("login"); // Go to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      setCurrentPage("login"); // Go to login page even on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <PageRouter
        currentPage={currentPage}
        profile={profile}
        isAdmin={isAdmin}
        items={items}
        cart={cart}
        favorites={favorites}
        orders={orders}
        notifications={notifications}
        paymentMethods={paymentMethods}
        favoriteTab={favoriteTab}
        loading={loading}
        loadingItems={loadingItems}
        formatCurrency={formatCurrency}
        changePage={changePage}
        goBack={goBack}
        handleLogout={handleLogout}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartQty={updateCartQty}
        toggleFavorite={toggleFavorite}
        setFavoriteTab={setFavoriteTab}
        setCart={setCart}
        setOrders={setOrders}
        addNewItem={addNewItem}
        deleteItem={deleteItem}
        updateOrderStatus={updateOrderStatus}
        updateUserRole={updateUserRole}
        fetchAllOrders={fetchAllOrders}
        fetchAllUsers={fetchAllUsers}
      />
      
      <LoadingOverlay loading={loading} />
    </div>
  );
}