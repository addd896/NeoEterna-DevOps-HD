import { Link } from "react-router-dom";
import finalLogo from "../assets/finalLogo.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      <img src={finalLogo} alt="NeoEterna Logo" className="w-28 mb-6" />

      <h1 className="text-4xl font-bold text-dodgerblue mb-2">404 - Page Not Found</h1>
      <p className="text-gray-400 text-lg mb-6">
        Hmm... looks like this capsule doesn’t exist. Maybe it’s still locked? ⏳
      </p>

      <Link
        to="/"
        className="px-5 py-2 bg-neon-purple text-black font-semibold rounded hover:bg-neon-blue transition"
      >
        🔙 Go Back Home
      </Link>
    </div>
  );
}
