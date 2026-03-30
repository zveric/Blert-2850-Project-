import React, { useState } from 'react';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Login</h2>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input 
            name="username" 
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-slate-300 rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}