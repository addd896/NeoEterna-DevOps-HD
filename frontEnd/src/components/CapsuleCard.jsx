import { useState } from "react";
import PropTypes from "prop-types";
import { Lock, Unlock, CalendarDays, Eye, Trash2, Sparkles, AlertTriangle ,Wallet} from "lucide-react";
import { motion } from "framer-motion";
import axios from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function CapsuleCard({ capsule, onView, onMint, onDelete }) {
  const { user } = useAuth();
  const [minting, setMinting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!capsule) return null;

  const unlockDate = capsule.unlockTimestamp
    ? new Date(capsule.unlockTimestamp * 1000).toLocaleString()
    : null;

  const isUnlocked = capsule.unlockTimestamp <= Math.floor(Date.now() / 1000);
  const isConfirmed = capsule.confirmed === true;
  const hasWallet = !!user?.walletAddress;

    const handleMint = async () => {
      if (!hasWallet) {
        toast.error("Connect your wallet to continue minting");
        return;
      }
  
      if (isUnlocked) {
        toast.error("❌ Cannot mint an already unlocked capsule.");
        return;
      }
  
      if (!isConfirmed) {
        toast.error("❌ Capsule not yet confirmed on Arweave.");
        return;
      }
  

    try {
      setMinting(true);
      await axios.post(`/capsules/mint/${capsule._id}`);
      toast.success("🎉 Capsule minted successfully!");
      if (onMint) onMint(capsule._id);
    } catch (err) {
      const msg = err.response?.data?.message || "Minting failed";
      toast.error("❌ " + msg);
      console.error("Mint error:", err);
      toast.error(" Minting failed");
      console.error("Mint error:", err);
    } finally {
      setMinting(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this capsule?");
    if (!confirm) return;

    try {
      setDeleting(true);
      await axios.delete(`/capsules/${capsule._id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.success("🗑️ Capsule deleted");
      if (onDelete) onDelete(capsule._id);
    } catch (err) {
      toast.error("❌ Delete failed");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-[#1e1e1e] text-white rounded-xl shadow-lg p-5 border border-neutral-700"
    >
      {/* Thumbnail */}
      {capsule.thumbnail && (
        <img
          src={capsule.thumbnail}
          alt="Capsule Thumbnail"
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      {/* Title & Lock Status */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold truncate">{capsule.title || "Untitled Capsule"}</h3>
        {isUnlocked ? <Unlock className="text-green-400" /> : <Lock className="text-yellow-400" />}
      </div>

      {/* Metadata */}
      <p className="text-xs text-gray-400 mb-1">
        <span className="font-medium">Category:</span> {capsule.category || "N/A"}
      </p>

      {/* Unlock Info */}
      {unlockDate && (
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <CalendarDays className="w-4 h-4" />
          <span>{unlockDate}</span>
        </div>
      )}

      {/* Minting Status */}
      <p className="text-xs mt-2 mb-2 font-semibold">
        {capsule.mintTxHash ? (
          <span className="text-green-400">✅ Minted</span>
        ) : (
          <span className="text-yellow-400">Not minted</span>
        )}
      </p>

        {/* Info Messages */}
         {!hasWallet && !capsule.mintTxHash && (
        <p className="text-sm text-red-400 flex items-center gap-1 mb-2">
          <Wallet className="w-4 h-4" /> Connect wallet to mint
        </p>
      )}
      {!isConfirmed && !capsule.mintTxHash && (
        <p className="text-sm text-yellow-400 flex items-center gap-1 mb-2">
          <AlertTriangle className="w-4 h-4" /> Capsule not yet confirmed on Arweave
        </p>
      )}
      {isUnlocked && !capsule.mintTxHash && (
        <p className="text-sm text-red-500 flex items-center gap-1 mb-2">
          <AlertTriangle className="w-4 h-4" /> Cannot mint — capsule already unlocked
        </p>
      )}


      {/* Action Buttons */}
      <div className="flex justify-between mt-4 flex-wrap gap-2">
        <button
          onClick={() => onView(capsule)}
          className="text-sm px-3 py-1 bg-neon-purple text-black rounded hover:bg-neon-blue transition"
        >
          <Eye className="inline-block w-4 h-4 mr-1" />
          View
        </button>

        {!capsule.mintTxHash && (
          <>
            <button
            onClick={handleMint}
            disabled={minting || isUnlocked || !isConfirmed}
            className={`text-sm px-3 py-1 bg-green-600 text-black rounded transition disabled:opacity-50 ${
              isUnlocked ? "cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
              {minting ? "Minting..." : (
                <>
                  <Sparkles className="inline-block w-4 h-4 mr-1" />
                  Mint
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting || minting}
              className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? "Deleting..." : (
                <>
                  <Trash2 className="inline-block w-4 h-4 mr-1" />
                  Delete
                </>
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

CapsuleCard.propTypes = {
  capsule: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    locked: PropTypes.bool,
    unlockTimestamp: PropTypes.number,
    category: PropTypes.string,
    thumbnail: PropTypes.string,
    mintTxHash: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onMint: PropTypes.func,
  onDelete: PropTypes.func,
};
