import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";

export default function LoginPage({ changePage, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(email, password) {
    if (isLoading) return;
    
    setLoginError("");
    
    if (!email || !password) {
      setLoginError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setLoginError("Invalid email or password. Please try again.");
        } else {
          setLoginError(error.message || "Login failed. Please check your credentials.");
        }
        return;
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignUpRedirect = () => {
    changePage("signup");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Replace the badge div with SVG logo */}
        <div className="w-32 h-32 rounded-full border-4 border-blue-400 bg-white shadow-lg mx-auto flex items-center justify-center overflow-hidden mb-6">
          <img 
            src="/maison logo.svg" 
            alt="Maison D'Assiettes" 
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-xl font-bold text-blue-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-sm mb-8">Sign in to continue exploring antiques</p>

        <div className="w-full space-y-4 max-w-xs">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {loginError}
            </div>
          )}
          
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
              placeholder="Email address"
              type="email"
            />
          </div>
          
          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
              placeholder="Password"
              type="password"
            />
          </div>
          
          <button
            disabled={isLoading}
            onClick={() => handleLogin(email, password)}
            className={`w-full py-3 rounded-full border-2 font-semibold transition text-sm ${
              isLoading 
                ? 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          
          <div className="text-center text-xs text-gray-600 pt-4 border-t border-gray-200">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold hover:text-blue-700"
              onClick={handleSignUpRedirect}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}