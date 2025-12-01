import React, { useState } from "react";
import { supabase } from "../../supabaseClient.js";

export default function SignUpPage({ changePage, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [signupError, setSignupError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignUp() {
    if (loading) return;
    
    setSignupError("");
    setSuccessMessage("");

    // Validate inputs
    if (!email || !password || !displayName) {
      setSignupError("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (authError) {
        console.error("Signup auth error:", authError);
        setSignupError(authError.message || "Signup failed");
        return;
      }

      if (authData.user) {
        // Create profile in database
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: email.trim().toLowerCase(),
              display_name: displayName,
              role: 'customer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Don't show error to user if profile fails - auth user is still created
          }
        } catch (profileErr) {
          console.error("Profile creation exception:", profileErr);
        }

        // Check if email confirmation is required
        if (authData.user.identities && authData.user.identities.length === 0) {
          setSuccessMessage(
            "A user with this email already exists. Please try logging in instead."
          );
          setTimeout(() => changePage("login"), 3000);
          return;
        }

        if (!authData.user.email_confirmed_at) {
          setSuccessMessage(
            "Account created successfully! Please check your email to confirm your account. " +
            "After confirming, you can log in."
          );
        } else {
          setSuccessMessage(
            "Account created successfully! You can now log in."
          );
          setTimeout(() => changePage("login"), 2000);
        }
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      setSignupError("An unexpected error occurred. Please try again.");
    }
  }

  const handleLoginRedirect = () => {
    changePage("login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-32 h-32 rounded-full border-4 border-blue-400 bg-white shadow-lg mx-auto flex items-center justify-center overflow-hidden mb-8">
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
        
        <h1 className="text-xl font-bold text-blue-900 mb-2">Create Account</h1>
        <p className="text-gray-600 text-sm mb-6">Join our antique community</p>

        <div className="w-full space-y-4 max-w-xs">
          {signupError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {signupError}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-lg">
              {successMessage}
            </div>
          )}
          
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
            placeholder="Display Name *"
            type="text"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
            placeholder="Email *"
            type="email"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400"
            placeholder="Password (min. 6 characters) *"
            type="password"
            required
            minLength={6}
          />
          
          <button
            type="button"
            disabled={loading || successMessage}
            onClick={handleSignUp}
            className={`w-full py-2.5 rounded-full border-2 text-gray-800 font-semibold transition text-sm ${
              successMessage 
                ? 'bg-green-100 border-green-400 cursor-not-allowed' 
                : 'bg-blue-200 border-blue-400 hover:bg-blue-300'
            }`}
          >
            {loading ? "Creating account..." : 
             successMessage ? "Account Created!" : 
             "Create Account"}
          </button>
          
          <div className="text-center text-xs text-gray-600 pt-4 border-t border-gray-200">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold hover:text-blue-700"
              onClick={handleLoginRedirect}
            >
              Log In
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