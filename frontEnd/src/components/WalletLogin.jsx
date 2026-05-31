import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { BrowserProvider } from "ethers";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const WalletLogin = () => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleWalletLogin = async () => {
       if (loading) return;
      setLoading(true);

      try {
        //  Check for MetaMask
        if (!window.ethereum) {
          alert("Please install MetaMask to continue.");
          return;
        }
  
        const provider = new BrowserProvider(window.ethereum);

        let accounts;
    try {
      accounts = await provider.send("eth_requestAccounts", []);
    } catch (err) {
      if (err.code === -32002) {
        alert("MetaMask is already connecting. Please check your wallet popup.");
        return;
      }
      throw err; 
    }
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
  
        const address = await signer.getAddress();
        const message = `Login to NeoEterna as ${address}`;
        const signature = await signer.signMessage(message);
  
        // Send signature to backend for JWT
        const res = await axiosInstance.post("/auth/verify-signature", {
          walletAddress:address,
          message,
          signature,
        });
  
        // Store user + token using global context
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      } catch (err) {
      console.error("Wallet login error:", err);
      alert("Wallet login failed.");
    } finally {
      setLoading(false);
    }
  };
  
    return (
      <motion.button
        onClick={handleWalletLogin}
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Connecting..." : "🔐 Connect Wallet"}
      </motion.button>
    );
  };
  
  export default WalletLogin;