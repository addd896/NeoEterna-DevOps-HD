import { motion } from "framer-motion";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {

    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });

const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState('');
const { login } = useAuth();
const navigate = useNavigate();

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit registration to backend
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Auto-login after register
      const res = await axios.post('/auth/register', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

    login(res.data.user, res.data.token); // 
    navigate('/dashboard');
    }
    catch (err) {
      const msg = err.response?.data?.error;
      if (msg === "User already exists") {
        alert("User already exists. Please log in instead.");
      } else {
        alert(msg || "Registration failed. Please try again.");
      }
      console.error("❌ Register error:", msg || err.message);
      setErrorMsg(msg || "Registration failed.");
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
        Create a NeoEterna Account
      </h2>

      {errorMsg && <p className="text-red-500 mb-2 ">{errorMsg}</p>}

      <form onSubmit={handleRegister} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            required
             name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
          />
        </div>
         
        <div>
          <label className="block text-sm text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            required
             name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            required
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            required
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
            placeholder="••••••••"
          />
        </div>
        

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dodgerblue text-black font-semibold py-2 rounded-md hover:bg-blue-400 transition hover:bg-gray-800 disabled:opacity-50 ">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </motion.div>
  );
};

export default RegisterForm;
