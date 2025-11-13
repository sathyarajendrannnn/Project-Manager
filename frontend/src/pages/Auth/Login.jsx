import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // ✅ Always allow login for any valid email/password
    toast.success("Login Successful 🎉");

    // ✅ Store role in localStorage before navigating
    // Default to admin role for demo purposes
    localStorage.setItem("role", "admin");

    setTimeout(() => {
      navigate("/dashboard"); // ✅ Redirect
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 relative overflow-hidden">
      {/* 3D Floating Background Elements */}
      <div className="absolute w-80 h-80 bg-blue-400 rounded-3xl mix-blend-multiply filter blur-3xl opacity-20 animate-float -top-24 -left-24 rotate-12"></div>
      <div className="absolute w-96 h-96 bg-cyan-400 rounded-3xl mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow top-1/2 -right-32 -rotate-12"></div>
      <div className="absolute w-72 h-72 bg-indigo-300 rounded-3xl mix-blend-multiply filter blur-3xl opacity-15 animate-float -bottom-20 left-1/3 rotate-45"></div>
      
      {/* 3D Cube Elements */}
      <div className="absolute w-16 h-16 bg-white/30 backdrop-blur-sm rounded-xl shadow-2xl transform rotate-45 top-1/4 left-1/4 animate-pulse-slow border border-white/40"></div>
      <div className="absolute w-12 h-12 bg-blue-300/40 backdrop-blur-sm rounded-lg shadow-xl transform -rotate-12 bottom-1/3 right-1/4 animate-bounce-slow border border-white/30"></div>
      <div className="absolute w-20 h-20 bg-cyan-300/30 backdrop-blur-sm rounded-2xl shadow-2xl transform rotate-12 top-1/3 right-1/3 animate-pulse border border-white/20"></div>

      {/* Main 3D Glassmorphism Card with Enhanced Effects */}
      <div className="w-full max-w-md bg-white/25 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40 relative overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {/* Card Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
        
        {/* Subtle Border Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-indigo-400/10 blur-sm pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* 3D Title with Gradient */}
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
            Welcome Back
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* 3D Input Fields */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-blue-200/80 rounded-xl focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none shadow-lg transform transition-all duration-200 group-hover:shadow-xl group-hover:scale-105"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-blue-200/80 rounded-xl focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none shadow-lg transform transition-all duration-200 group-hover:shadow-xl group-hover:scale-105"
              />
            </div>

            {/* 3D Button with Hover Effects */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 border border-white/20 relative overflow-hidden group"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10">Sign In</span>
            </button>
          </form>

          {/* 3D Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 relative group"
              >
                Sign Up
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute w-3 h-3 bg-blue-400/40 rounded-full top-10 right-20 animate-bounce"></div>
      <div className="absolute w-2 h-2 bg-cyan-400/50 rounded-full bottom-20 left-20 animate-bounce delay-300"></div>
      <div className="absolute w-4 h-4 bg-indigo-300/30 rounded-full top-40 right-40 animate-bounce delay-700"></div>
    </div>
  );
};

export default Login;