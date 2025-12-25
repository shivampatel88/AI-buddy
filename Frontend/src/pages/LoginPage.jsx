import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { toast } from 'react-hot-toast';
import apiClient from "../services/api";
import { handleApiError } from '../utils/errorHandler';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post("/auth/login", formData);
      const { token, message } = res.data;
      localStorage.setItem('token', token);
      toast.success(message || "Logged in successfully!");
      navigate('/dashboard');
    } catch (err) {
      handleApiError(err, null, 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Logo />
            <span className="text-2xl font-bold text-slate-900">Study Buddy</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-slate-600 mb-8">Log in to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-slate-100 pl-10 pr-3 py-2.5 rounded-lg border border-transparent focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition"
                  placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type={showPwd ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  className="w-full bg-slate-100 pl-10 pr-10 py-2.5 rounded-lg border border-transparent focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging In...</span>
                </>
              ) : "Log In"}
            </motion.button>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-center">
            <LogIn className="mx-auto h-16 w-16 mb-6 text-indigo-200" />
            <h2 className="text-3xl font-bold mb-4">Pick Up Where You Left Off</h2>
            <p className="text-indigo-200 max-w-sm mx-auto">
              Access your personalized dashboard, review your flashcards, and take quizzes to master your subjects.
            </p>
            <img
              src="/dashboard-preview.png"
              alt="A preview of the user dashboard"
              className="mt-6 rounded-lg shadow-xl max-h-64 w-auto mx-auto object-contain" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
