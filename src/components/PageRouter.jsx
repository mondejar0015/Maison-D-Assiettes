import React from "react";
import StartingPage from "./pages/StartingPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AddItemPage from "./pages/AddItemPage.jsx";
import PersonalInfoPage from "./pages/PersonalInfoPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import PaymentMethodPage from "./pages/PaymentMethodPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import SecurityPage from "./pages/SecurityPage.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminInventory from "./admin/AdminInventory.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";

export default function PageRouter({
  currentPage,
  authLoading,
  loading,
  loadingItems,
  profile,
  isAdmin,
  items,
  cart,
  setCart,
  favorites,
  orders,
  setOrders,
  notifications,
  paymentMethods,
  adminItems,
  favoriteTab,
  formatCurrency,
  changePage,
  goBack,
  handleLogout,
  addToCart,
  removeFromCart,
  updateCartQty,
  toggleFavorite,
  addNewItem,
  deleteItem,
  addCard,
  removeCard,
  markNotificationAsRead,
  setFavoriteTab,
  fetchAllOrders,
  fetchAllUsers,
  updateOrderStatus,
  updateUserRole
}) {
  console.log("🔄 PageRouter rendering:", currentPage, "isAdmin:", isAdmin, "profile:", profile ? "exists" : "none");
  
  // Show loading page first
  if (currentPage === "loading") {
    return <LoadingPage />;
  }
  
  // Show starting page (splash screen)
  if (currentPage === "starting") {
    return <StartingPage changePage={changePage} />;
  }
  
  // IMPORTANT FIX: If user is already logged in and tries to access login/signup, redirect to home
  if (profile && (currentPage === "login" || currentPage === "signup")) {
    console.log("✅ User already logged in, redirecting from", currentPage, "to home");
    // Use useEffect-like behavior with setTimeout to avoid render loop
    React.useEffect(() => {
      if (profile) {
        const timer = setTimeout(() => {
          changePage("home");
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [profile, changePage]);
    
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-500">Already logged in. Redirecting to home...</div>
    </div>;
  }
  
  // Define which pages are accessible without authentication
  const publicPages = ["login", "signup", "starting", "home", "categories"];
  
  // Only redirect to login if user tries to access protected pages without profile
  if (!profile && !publicPages.includes(currentPage)) {
    console.log("👤 No profile for protected page, redirecting to login");
    // Use useEffect to avoid render issues
    React.useEffect(() => {
      const timer = setTimeout(() => {
        changePage("login");
      }, 100);
      return () => clearTimeout(timer);
    }, [changePage]);
    
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-500">Redirecting to login...</div>
    </div>;
  }

  // Admin-specific routes
  if (isAdmin) {
    switch (currentPage) {
      case "adminDashboard":
        return <AdminDashboard 
          profile={profile}
          items={items}
          adminItems={adminItems}
          formatCurrency={formatCurrency}
          changePage={changePage}
          handleLogout={handleLogout}
          fetchAllOrders={fetchAllOrders}
          fetchAllUsers={fetchAllUsers}
        />;
      case "adminInventory":
        return <AdminInventory 
          adminItems={adminItems}
          formatCurrency={formatCurrency}
          addNewItem={addNewItem}
          deleteItem={deleteItem}
          goBack={goBack}
          loading={loading}
          changePage={changePage}
        />;
      case "adminOrders":
        return <AdminOrders 
          fetchAllOrders={fetchAllOrders}
          formatCurrency={formatCurrency}
          updateOrderStatus={updateOrderStatus}
          goBack={goBack}
          loading={loading}
          changePage={changePage}
        />;
      case "adminUsers":
        return <AdminUsers 
          fetchAllUsers={fetchAllUsers}
          updateUserRole={updateUserRole}
          goBack={goBack}
          loading={loading}
          changePage={changePage}
        />;
    }
  }

  // Regular user routes
  switch (currentPage) {
    case "login":
      return <LoginPage changePage={changePage} loading={loading} />;
    case "signup":
      return <SignUpPage changePage={changePage} loading={loading} />;
    case "personal":
      return <PersonalInfoPage 
        profile={profile} 
        goBack={goBack} 
        loading={loading} 
        changePage={changePage}
      />;
    case "favorites":
      return <FavoritesPage 
        items={items} 
        favorites={favorites} 
        favoriteTab={favoriteTab} 
        setFavoriteTab={setFavoriteTab}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
        formatCurrency={formatCurrency}
        goBack={goBack}
        changePage={changePage}
      />;
    case "paymentMethod":
      return <PaymentMethodPage 
        paymentMethods={paymentMethods} 
        loading={loading} 
        addCard={addCard} 
        removeCard={removeCard} 
        goBack={goBack}
        changePage={changePage}
      />;
    case "notifications":
      return <NotificationsPage 
        notifications={notifications} 
        markNotificationAsRead={markNotificationAsRead} 
        goBack={goBack}
        changePage={changePage}
      />;
    case "security":
      return <SecurityPage 
        goBack={goBack} 
        loading={loading}
        changePage={changePage}
      />;
    case "cart":
      return <CartPage 
        cart={cart} 
        formatCurrency={formatCurrency} 
        removeFromCart={removeFromCart} 
        updateCartQty={updateCartQty} 
        changePage={changePage} 
        goBack={goBack} 
      />;
    case "checkout":
      return <CheckoutPage 
        cart={cart} 
        profile={profile} 
        formatCurrency={formatCurrency} 
        changePage={changePage} 
        goBack={goBack} 
        loading={loading}
        setCart={setCart}
        setOrders={setOrders}
      />;
    case "addItem":
      // Only admin can add items
      if (!isAdmin) {
        alert("Admin access required");
        changePage("home");
        return null;
      }
      return <AddItemPage 
        addNewItem={addNewItem} 
        goBack={goBack} 
        loading={loading}
        changePage={changePage}
      />;
    case "history":
      return <HistoryPage 
        orders={orders} 
        formatCurrency={formatCurrency}
        changePage={changePage}
      />;
    case "categories":
      return <CategoriesPage 
        items={items} 
        favorites={favorites} 
        formatCurrency={formatCurrency} 
        toggleFavorite={toggleFavorite} 
        addToCart={addToCart}
        changePage={changePage}
      />;
    case "profile":
      return <ProfilePage 
        profile={profile} 
        orders={orders} 
        favorites={favorites} 
        notifications={notifications} 
        formatCurrency={formatCurrency} 
        changePage={changePage} 
        handleLogout={handleLogout}
        loading={loading} 
      />;
    case "home":
    default:
      return <HomePage 
        items={items} 
        loadingItems={loadingItems} 
        cart={cart} 
        favorites={favorites} 
        formatCurrency={formatCurrency} 
        changePage={changePage} 
        toggleFavorite={toggleFavorite} 
        addToCart={addToCart} 
      />;
  }
}