import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CreateCapsule() {
  const { token, walletAddress } = useAuth();
  const navigate = useNavigate();

  // Protect route if user not authenticated
  useEffect(() => {
    if (!token || !walletAddress) {
      navigate("/login");
    }
  }, [token, walletAddress]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-dodgerblue mb-6">
          🧾 Create a New Capsule
        </h1>

        <p className="text-sm text-gray-400 mb-6">
          Upload your document, image, or message — we’ll verify it, encrypt it, and mint it to the blockchain as your time capsule.
        </p>

        <UploadForm />
      </div>
    </div>
  );
}
