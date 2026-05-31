import { motion } from "framer-motion";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const FormLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`/auth/login`, {
        email: email.trim(),
        password,
      });

      login(res.data.user, res.data.token);
      if (onLogin) onLogin(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setPassword('');
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
      console.error('Login error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
    className="max-w-md mx-auto mt-20 bg-[#1e1e1e] text-white p-8 rounded-xl shadow-lg border border-neutral-800"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h2 className="text-3xl font-semibold mb-6 text-center text-dodgerblue">
      Welcome Back to NeoEterna
    </h2>

    {error && <p className="text-red-500 mb-2">{error}</p>}
     
     <form onSubmit={handleEmailLogin} className="space-y-4">
     <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
         <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
           </div>

   <div>
  <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dodgerblue text-black font-semibold py-2 rounded-md hover:bg-blue-400 transition hover:bg-gray-800 disabled:opacity-50"
           >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        </motion.div>
  );
};

export default FormLogin;
