import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimeLockModal = ({ isOpen, onClose, onConfirm }) => {
  const [dateTime, setDateTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTimestamp = new Date(dateTime).getTime();
    const now = Date.now();

    if (!dateTime || selectedTimestamp <= now) {
      alert("Please select a future date and time.");
      return;
    }

    onConfirm(selectedTimestamp); // Send back UNIX timestamp
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-md shadow-lg text-white border border-gray-700"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold text-dodgerblue mb-4">
              ⏳ Set Unlock Date & Time
            </h2>

            <div className="space-y-4">
              {/* Date/Time Picker */}
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-4 py-2 rounded bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue"
                required
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm px-4 py-2 border border-gray-500 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="text-sm px-4 py-2 bg-dodgerblue text-black font-medium rounded hover:bg-blue-400 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

TimeLockModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default TimeLockModal;
