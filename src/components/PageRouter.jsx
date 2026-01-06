import React, { useEffect } from "react";
import { supabase, SUPABASE_CONFIGURED } from "../supabaseClient";

// Import all pages
import StartingPage from "./pages/StartingPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import PaymentMethodPage from "./pages/PaymentMethodPage.jsx";
import PersonalInfoPage from "./pages/PersonalInfoPage.jsx";
import SecurityPage from "./pages/SecurityPage.jsx";
import AddItemPage from "./pages/AddItemPage.jsx";

// Admin components
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminInventory from "./admin/AdminInventory.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";

/**
 * Safe helper to get session/user supporting different supabase client shapes.
 */
function getSessionSafe() {
  try {
    if (!supabase || !supabase.auth) {
      return Promise.resolve({ data: { session: null }, error: null });
    }

    // Supabase v2
    if (typeof supabase.auth.getSession === "function") {
      return supabase.auth.getSession();
    }

    // Supabase v2 alternate: getUser()
    if (typeof supabase.auth.getUser === "function") {
      return supabase.auth.getUser().then((r) => ({
        data: { session: r.data ? { user: r.data.user || r.data } : null },
        error: r.error || null,
      }));
    }

    // Older shape: session or user properties
    if (supabase.auth.session || supabase.auth.user) {
      return Promise.resolve({
        data: { session: supabase.auth.session || { user: supabase.auth.user } },
        error: null,
      });
    }

    return Promise.resolve({ data: { session: null }, error: null });
  } catch (err) {
    return Promise.resolve({ data: { session: null }, error: err });
  }
}

export default function PageRouter({
  currentPage,
  profile,
  isAdmin,
  items,
  cart,
  favorites,
  orders,
  notifications,
  paymentMethods,
  favoriteTab,
  loading,
  loadingItems,
  formatCurrency,
  changePage,
  goBack,
  handleLogout,
  addToCart,
  removeFromCart,
  updateCartQty,
  toggleFavorite,
  setFavoriteTab,
  setCart,
  setOrders,
  addNewItem,
  deleteItem,
  updateOrderStatus,
  updateUserRole,
  fetchAllOrders,
  fetchAllUsers,
}) {
  console.log("PageRouter rendering:", currentPage);
  console.log('VITE_SUPABASE_URL=', import.meta.env.VITE_SUPABASE_URL);

  // Attempt an initial auth check if the app is on the starting/loading page.
  useEffect(() => {
    async function checkAuth() {
      if (!SUPABASE_CONFIGURED) {
        console.error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env (local .env.local and Vercel).');
        changePage('login'); // or show a friendly UI that explains configuration is missing
        return;
      }

      // Skip if no supabase url configured
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Skipping Supabase auth init: VITE_SUPABASE_URL not set.");
        return;
      }

      // Only run auth check if we're on starting or loading so we don't override manual navigation
      if (!["starting", "loading"].includes(currentPage)) return;

      try {
        const { data, error } = await getSessionSafe();
        if (error) {
          console.warn("Auth check returned error:", error);
          changePage("login");
          return;
        }

        if (data?.session?.user) {
          // If a user is present, navigate to home (or adminDashboard if parent already set isAdmin)
          // Parent may override based on profile/isAdmin prop; this is a best-effort fallback.
          changePage(isAdmin ? "adminDashboard" : "home");
        } else {
          changePage("login");
        }
      } catch (err) {
        console.warn("Auth check error:", err);
        changePage("login");
      }
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Use effects for redirects when profile prop changes
  useEffect(() => {
    if (profile && (currentPage === "login" || currentPage === "signup")) {
      const timer = setTimeout(() => {
        if (isAdmin) {
          changePage("adminDashboard");
        } else {
          changePage("home");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profile, currentPage, isAdmin, changePage]);

  useEffect(() => {
    if (!profile && !["login", "signup", "starting", "loading"].includes(currentPage)) {
      const timer = setTimeout(() => {
        changePage("login");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profile, currentPage, changePage]);

  // Show loading page
  if (currentPage === "loading") {
    return <LoadingPage />;
  }

  // Show starting page
  if (currentPage === "starting") {
    return <StartingPage changePage={changePage} />;
  }

  // Show login page
  if (currentPage === "login") {
    return <LoginPage changePage={changePage} loading={loading} />;
  }

  // Show signup page
  if (currentPage === "signup") {
    return <SignUpPage changePage={changePage} loading={loading} />;
  }

  // If redirecting due to auth state, show loading
  if (
    (profile && (currentPage === "login" || currentPage === "signup")) ||
    (!profile && !["login", "signup", "starting", "loading"].includes(currentPage))
  ) {
    return <LoadingPage />;
  }

  // ADMIN PAGES
  if (isAdmin) {
    switch (currentPage) {
      case "adminDashboard":
        return (
          <AdminDashboard
            profile={profile}
            items={items}
            formatCurrency={formatCurrency}
            changePage={changePage}
            handleLogout={handleLogout}
            fetchAllOrders={fetchAllOrders}
            fetchAllUsers={fetchAllUsers}
          />
        );
      case "adminInventory":
        return (
          <AdminInventory
            adminItems={items}
            formatCurrency={formatCurrency}
            addNewItem={addNewItem}
            deleteItem={deleteItem}
            goBack={() => changePage("adminDashboard")}
            loading={loading}
            changePage={changePage}
          />
        );
      case "adminOrders":
        return (
          <AdminOrders
            fetchAllOrders={fetchAllOrders}
            formatCurrency={formatCurrency}
            updateOrderStatus={updateOrderStatus}
            goBack={() => changePage("adminDashboard")}
            loading={loading}
            changePage={changePage}
          />
        );
      case "adminUsers":
        return (
          <AdminUsers
            fetchAllUsers={fetchAllUsers}
            updateUserRole={updateUserRole}
            goBack={() => changePage("adminDashboard")}
            loading={loading}
            changePage={changePage}
          />
        );
      case "addItem":
        return (
          <AddItemPage
            addNewItem={addNewItem}
            goBack={() => changePage("adminInventory")}
            loading={loading}
            changePage={changePage}
          />
        );
      default:
        return (
          <AdminDashboard
            profile={profile}
            items={items}
            formatCurrency={formatCurrency}
            changePage={changePage}
            handleLogout={handleLogout}
            fetchAllOrders={fetchAllOrders}
            fetchAllUsers={fetchAllUsers}
          />
        );
    }
  }

  // USER PAGES
  switch (currentPage) {
    case "home":
      return (
        <HomePage
          items={items}
          loadingItems={loadingItems}
          cart={cart}
          favorites={favorites}
          formatCurrency={formatCurrency}
          changePage={changePage}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
        />
      );
    case "categories":
      return (
        <CategoriesPage
          items={items}
          favorites={favorites}
          formatCurrency={formatCurrency}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
          changePage={changePage}
        />
      );
    case "cart":
      return (
        <CartPage
          cart={cart}
          formatCurrency={formatCurrency}
          removeFromCart={removeFromCart}
          updateCartQty={updateCartQty}
          changePage={changePage}
          goBack={goBack}
        />
      );
    case "checkout":
      return (
        <CheckoutPage
          cart={cart}
          profile={profile}
          formatCurrency={formatCurrency}
          changePage={changePage}
          goBack={goBack}
          loading={loading}
          setCart={setCart}
          setOrders={setOrders}
        />
      );
    case "favorites":
      return (
        <FavoritesPage
          items={items}
          favorites={favorites}
          favoriteTab={favoriteTab}
          setFavoriteTab={setFavoriteTab}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
          formatCurrency={formatCurrency}
          goBack={() => changePage("profile")}
          changePage={changePage}
        />
      );
    case "history":
      return (
        <HistoryPage orders={orders} formatCurrency={formatCurrency} changePage={changePage} goBack={goBack} />
      );
    case "notifications":
      return <NotificationsPage notifications={notifications} goBack={() => changePage("profile")} />;
    case "paymentMethod":
      return (
        <PaymentMethodPage paymentMethods={paymentMethods} loading={loading} goBack={() => changePage("profile")} />
      );
    case "personal":
      return <PersonalInfoPage profile={profile} goBack={() => changePage("profile")} loading={loading} />;
    case "security":
      return <SecurityPage goBack={() => changePage("profile")} loading={loading} />;
    case "profile":
      return (
        <ProfilePage
          profile={profile}
          orders={orders}
          favorites={favorites}
          notifications={notifications}
          formatCurrency={formatCurrency}
          changePage={changePage}
          handleLogout={handleLogout}
          loading={loading}
        />
      );
    default:
      return <LoadingPage />;
  }
}