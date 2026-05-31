import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function TransferModal({ isOpen, onClose, onTransfer }) {
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!recipient) return alert("Please enter a recipient address");
    setLoading(true);
    await onTransfer(recipient);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Transfer Capsule NFT</h2>

        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient wallet address"
          className="w-full px-4 py-2 mb-4 rounded bg-neutral-800 text-white"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border border-gray-500 rounded text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-sm px-4 py-2 bg-neon-purple text-black rounded hover:bg-neon-blue transition disabled:opacity-50"
          >
            {loading ? "Transferring..." : "Transfer"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

TransferModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
};
