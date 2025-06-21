import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/Authcontext'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authApi } from '../../service/api';


const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/home');
    }
  }, [auth.isAuthenticated, navigate]);


  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast.error('User ID is required', {
        icon: <Lock className="text-red-500" />,
        theme: "dark",
        className: "bg-black/90 border-purple-900/30"
      });
      return;
    }

    if (!password.trim()) {
      toast.error('Password is required', {
        icon: <Lock className="text-red-500" />,
        theme: "dark",
        className: "bg-black/90 border-purple-900/30"
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({userId,password})

      if (response.success) {
        
        toast.success('Login successful!', {
          icon: <Lock className="text-green-500" />,
          theme: "dark",
          className: "bg-black/90 border-purple-900/30"
        });
        auth.login(response.data.userId, response.data.role, response.data.money);
        // Handle successful login
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid credentials', {
          icon: <Lock className="text-red-500" />,
          theme: "dark",
          className: "bg-black/90 border-purple-900/30"
        });
      } else {
        toast.error('Login failed. Please try again.', {
          icon: <Lock className="text-red-500" />,
          theme: "dark",
          className: "bg-black/90 border-purple-900/30"
        });
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-black/90 backdrop-blur-sm shadow-xl rounded-2xl max-w-md w-full p-6 space-y-6 md:p-8 transition-all duration-300 hover:shadow-2xl border border-purple-900/30">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-500">Login</h2>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-black/50 p-3 rounded-lg animate-fade-in border border-red-900/30">
            <Lock className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* User ID Input */}
        <div className="relative">
          <label htmlFor="userId" className="absolute left-3 top-3 text-sm text-white pointer-events-none transform -translate-y-2 scale-90 origin-left">
            User ID
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-6 pl-10 rounded-xl bg-black/70 border border-purple-900/30 focus:border-purple-500 focus:bg-black text-white placeholder:text-purple-300"
              placeholder="Enter your user ID"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="relative">
          <label htmlFor="password" className="absolute left-3 top-3 text-sm text-white pointer-events-none transform -translate-y-2 scale-90 origin-left">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-6 pl-10 rounded-xl bg-black/70 border border-purple-900/30 focus:border-purple-500 focus:bg-black text-white placeholder:text-purple-300"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-400"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-4 rounded-xl bg-purple-900 text-white font-semibold text-lg uppercase tracking-wide shadow-md hover:bg-purple-800 hover:shadow-lg active:scale-95 transition-all duration-200 ease-in-out border border-purple-700"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <ToastContainer
        position="top-right"
        theme="dark"
        className="text-white"
        toastClassName="bg-black/90 border border-purple-900/30"
        icon={true}
      />
    </div>
  );
};

export default LoginPage;