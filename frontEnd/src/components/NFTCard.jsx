import PropTypes from "prop-types";
import { useState } from "react";
import { Lock, Unlock, CalendarDays, Eye, Share2, Users } from "lucide-react";
import { motion } from "framer-motion";
import TransferModal from "./TransferModal";
import InheritanceModal from "./InheritanceModal";
import axios from "../api/axiosInstance";
import toast from "react-hot-toast";

export default function NFTCard({ nft, onView }) {
    const [showTransfer, setShowTransfer] = useState(false);
    const [showInherit, setShowInherit] = useState(false);

  if (!nft) return null;

  const isLocked = nft.unlockTimestamp > Date.now() / 1000;
  const unlockDate = new Date(nft.unlockTimestamp * 1000).toLocaleString();

  const handleTransfer = async (to) => {
    try {
      await axios.post("/nft/transfer", {
        tokenId: nft.tokenId,
        to
      });
      toast.success("✅ NFT transferred");
      setShowTransfer(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Transfer failed");
    }
  };

  const handleInheritance = async (beneficiary) => {
    try {
      await axios.post("/nft/inherit", {
        tokenId: nft.tokenId,
        beneficiary
      });
      toast.success("🧬 Inheritance assigned");
      setShowInherit(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to assign inheritance");
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-[#1e1e1e] text-white rounded-xl shadow-lg p-5 border border-neutral-700"
    >
      {/* Thumbnail */}
      {nft.thumbnail && (
        <img
          src={nft.thumbnail}
          alt="NFT Thumbnail"
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      {/* Title & Lock Status */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold truncate">{nft.title || "Untitled NFT"}</h3>
        {isLocked ? <Lock className="text-yellow-400" /> : <Unlock className="text-green-400" />}
      </div>

      {/* Unlock Date */}
      <p className="text-sm text-gray-400 mb-2">
        <CalendarDays className="inline w-4 h-4 mr-1" />
        {unlockDate}
      </p>

      {/* Ownership Badges */}
      <div className="flex gap-2 flex-wrap mb-2">
        {nft.isInherited && (
          <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
            👑 Inherited
          </span>
        )}
        {nft.isTransferred && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
            🔁 Transferred
          </span>
        )}
      </div>

      {/* Inherited From Info */}
      {nft.isInherited && nft.inheritedFrom && (
        <p className="text-xs text-gray-400">
          From: {nft.inheritedFrom.slice(0, 6)}...{nft.inheritedFrom.slice(-4)}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-4 flex-wrap gap-2">
        <button
          onClick={() => onView(nft)}
          className="text-sm px-3 py-1 bg-neon-purple text-black rounded hover:bg-neon-blue transition"
        >
          <Eye className="w-4 h-4 inline-block mr-1" />
          {isLocked ? "View NFT" : "Open NFT"}
        </button>
       
        {isLocked && (
          <>
            <button
              onClick={() => setShowTransfer(true)}
              className="text-sm px-3 py-1 border border-blue-500 text-blue-400 rounded hover:bg-blue-600 hover:text-white"
            >
              <Share2 className="inline-block w-4 h-4 mr-1" />
              Transfer
            </button>
            <button
              onClick={() => setShowInherit(true)}
              className="text-sm px-3 py-1 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black"
            >
              <Users className="inline-block w-4 h-4 mr-1" />
              Inherit
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <TransferModal
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        onTransfer={handleTransfer}
      />
      <InheritanceModal
        isOpen={showInherit}
        onClose={() => setShowInherit(false)}
        onSet={handleInheritance}
      />
    </motion.div>
  );
};

NFTCard.propTypes = {
  nft: PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    title: PropTypes.string,
    unlockTimestamp: PropTypes.number,
    thumbnail: PropTypes.string,
    isInherited: PropTypes.bool,
    isTransferred: PropTypes.bool,
    inheritedFrom: PropTypes.string,
    confirmed: PropTypes.bool,
  }).isRequired,
  onView: PropTypes.func.isRequired
};

