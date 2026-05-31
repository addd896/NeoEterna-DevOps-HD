import WalletLogin from "../components/WalletLogin";
import FormLogin from "../components/FormLogin";
import { Link } from "react-router-dom";
import finalLogo from "../assets/finalLogo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <img src={finalLogo} alt="NeoEterna Logo" className="w-36 mb-6" />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-dodgerblue mb-4">
        Welcome to NeoEterna
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Login with your wallet or credentials to access your time capsules.
      </p>

      {/* Container */}
      <div className="w-full max-w-md bg-[#1e1e1e] p-6 rounded-xl border border-neutral-700 shadow-lg space-y-6">
        {/* Wallet Login */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Wallet Login</h2>
          <WalletLogin />
        </div>

        <hr className="border-neutral-700" />

        {/* Email/Password Login */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Email Login</h2>
          <FormLogin
            onLogin={({ email, password }) =>
              console.log("Login with email", email, password)
            }
          />
        </div>
      </div>

      {/* Register Link */}
      <p className="mt-6 text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link to="/register" className="text-neon-purple hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
