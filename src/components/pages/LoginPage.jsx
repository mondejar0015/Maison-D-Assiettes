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
        console.error("Login error:", error);
        
        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          setLoginError(
            "Email not confirmed. Please check your inbox for the confirmation email. " +
            "If you didn't receive it, try signing up again or check your spam folder."
          );
          
          // Offer to resend confirmation email
          try {
            await supabase.auth.resend({
              type: 'signup',
              email: email.trim().toLowerCase(),
            });
            setLoginError(prev => prev + " A new confirmation email has been sent.");
          } catch (resendError) {
            console.error("Failed to resend confirmation:", resendError);
          }
        } else if (error.message.includes("Invalid login credentials")) {
          setLoginError("Invalid email or password. Please try again.");
        } else if (error.message.includes("User not found")) {
          setLoginError("No account found with this email. Please sign up first.");
        } else {
          setLoginError(error.message || "Login failed. Please check your credentials.");
        }
        return;
      }
      
      // Login successful - ensure profile exists
      if (data.user) {
        try {
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError || !profile) {
            // Create profile if it doesn't exist
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                display_name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0],
                role: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          }
        } catch (profileErr) {
          console.error("Profile check/creation error:", profileErr);
        }

        console.log("✅ Login successful:", data);
        // Auth listener in App.jsx will handle redirect to home
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignUpRedirect = () => {
    console.log("📝 Redirecting to signup page");
    changePage("signup");
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("demo123");
    // Auto-login after setting credentials
    setTimeout(() => {
      handleLogin("demo@example.com", "demo123");
    }, 100);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setLoginError("Please enter your email address first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setLoginError("Failed to send reset email: " + error.message);
      } else {
        setLoginError(`Password reset email sent to ${email}. Check your inbox.`);
      }
    } catch (err) {
      setLoginError("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-32 h-32 rounded-full border-4 border-blue-400 bg-white shadow-lg mx-auto flex items-center justify-center overflow-hidden mb-6">
          <div className="relative w-20 h-24 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-blue-900 rounded-t-full"
              style={{
                clipPath: "polygon(50% 0%, 100% 0%, 85% 100%, 15% 100%, 0% 0%)",
              }}
            ></div>
            <div className="relative z-10 text-center mt-3">
              <div className="text-yellow-400 text-xs font-bold mb-1">⚜️</div>
              <div className="text-white text-[7px] font-bold leading-tight px-2">
                MAISON
                <br />
                D'ASSIETTES
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-blue-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-sm mb-8">Sign in to continue exploring antiques</p>

        <div className="w-full space-y-4 max-w-xs">
          {loginError && (
            <div className={`text-xs p-3 rounded-lg ${
              loginError.includes("sent") 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
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
          
          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              className="text-blue-600 font-medium hover:text-blue-700"
              onClick={handleDemoLogin}
            >
              Use demo account
            </button>
            
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          
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
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => changePage("home")}
              className="text-xs text-gray-500 underline"
            >
              Continue as guest (limited access)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}