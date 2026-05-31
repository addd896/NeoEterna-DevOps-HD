import { useState } from "react";
import aiAxios from "../api/aiAxios";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import TimeLockModal from "./TimeLockModel";
import VerificationBadge from "./VerificationBadge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function UploadForm() {

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [showTimeLockModal, setShowTimeLockModal] = useState(false);
  const [timeLock, setTimeLock] = useState(null);
  const [unlockDate, setUnlockDate] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [previewURL, setPreviewURL] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [statusStage, setStatusStage] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const navigate = useNavigate();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const { walletAddress } = useAuth();
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];

     if (!selected) return;

    setFile(selected);
    setAiResult(null);
    setPreviewURL(URL.createObjectURL(selected));
    setLoading(true);
    setStatusStage("🔍 AI Verification");
    setEstimatedTime("~3 seconds");

    try {
      const formData = new FormData();
      formData.append("file", selected);

      const res = await aiAxios.post("/api/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { forgery, confidence } = res.data;

      setAiResult({
        status: forgery ? "forgery" : "authentic",
        confidence: confidence || 0,
      });

      if (forgery) {
        showToast("⚠️ Forgery detected. Please upload a valid file.", "error");
        setFile(null);
        setPreviewURL(null);
      }
    } catch (err) {
      console.error("AI verification error:", err);
      showToast("AI verification failed. Try again.", "error");
    } finally {
      setLoading(false);
      setStatusStage("");
      setEstimatedTime("");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submitted"); 


    if (!aiResult || aiResult.status === "forgery") {
      alert("Cannot submit a forged or unverified file.");
      return;
    }

    if (!file || !title || !desc || !category) {
      alert("Please fill out all required fields.");
      return;
    }
    
if (!walletAddress) {
  showToast("No wallet address found. Please log in via MetaMask or email.", "error");
  return;
}
    
    if (!category) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);
    setStatusStage("🔐 Encrypting...");
    setEstimatedTime("~5 seconds");
    await delay(1000);

    setStatusStage("☁️ Uploading to Arweave");
    setEstimatedTime("~10–20 seconds");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("category", category);
      formData.append("unlockTimestamp", unlockDate);
      formData.append("heir", walletAddress);

      const uploadRes = await axiosInstance.post("/capsules/create", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      const capsuleId = uploadRes.data?.data?._id;
      if (!capsuleId) throw new Error("Upload failed: No capsule ID returned");

      setStatusStage("🔗 Minting on Blockchain");
      setEstimatedTime("~10 seconds");

      showToast("🎉 Capsule uploaded!", "success");
      alert("🎉 Capsule uploaded ,verified and stored successfully!");

      setSuccessMsg("Capsule created successfully!");
      setStatusStage("✅ Done!");
      setEstimatedTime("");

      // Reset state
      setTitle("");
      setDesc("");
      setFile(null);
      setAiResult(null);
      setTimeLock(null);
      setUnlockDate("");
      setProgress(0);

      // Navigate to detail page
      navigate(`/capsule/${capsuleId}`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
      setStatusStage("❌ Upload failed");
      setEstimatedTime("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-dodgerblue">Upload a New Time Capsule</h2>

      {statusStage && (
        <div className="text-sm text-gray-300">
          <span className="font-semibold">{statusStage}</span>
          {estimatedTime && <span className="ml-2 text-xs text-gray-400">⏱ {estimatedTime}</span>}
        </div>
      )}

      <input
        type="text"
        placeholder="Capsule Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 rounded bg-neutral-800 placeholder-gray-400"
        required
      />

      <textarea
        placeholder="Capsule Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
        className="w-full p-3 rounded bg-neutral-800 placeholder-gray-400"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 rounded bg-neutral-800 text-white"
        required
      >
        <option value="">Select Category</option>
        <option value="personal">Personal</option>
        <option value="legal">Legal</option>
        <option value="academic">Academic</option>
        <option value="developer">Developer</option>
        <option value="artist">Artist</option>
        <option value="government">Government</option>
      </select>

      <label className="block">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,video/*,.pdf,.docx"
          className="block mt-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neon-purple file:text-black hover:file:bg-neon-blue"
          required
        />
      </label>

      {aiResult && (
        <VerificationBadge
          status={aiResult.status}
          confidence={aiResult.confidence}
        />
      )}

      {previewURL && (
        <div className="mt-2">
          <p className="text-sm text-gray-400">Preview:</p>
          <a href={previewURL} target="_blank" className="text-neon-purple underline">
            View File
          </a>
        </div>
      )}

      {(loading || statusStage) && (
        <div className="w-full bg-gray-700 rounded h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              statusStage.includes("Minting")
                ? "bg-yellow-400"
                : statusStage.includes("Arweave")
                ? "bg-blue-400"
                : statusStage.includes("Encrypting")
                ? "bg-purple-500"
                : "bg-neon-purple"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowTimeLockModal(true)}
          className="bg-transparent border border-neon-purple px-4 py-2 rounded hover:bg-neon-purple hover:text-black transition"
        >
          {timeLock
            ? `⏳ Unlocks at: ${new Date(timeLock).toLocaleString()}`
            : "Set Time Lock"}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-neon-purple text-black px-6 py-2 rounded-lg hover:bg-neon-blue transition disabled:opacity-50"
      >
        {loading ? `${statusStage || "Uploading"}...` : "Create Capsule"}
      </button>

      <TimeLockModal
        isOpen={showTimeLockModal}
        onClose={() => setShowTimeLockModal(false)}
      onConfirm={(timestamp) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    alert("Invalid unlock date");
    return;
  }
  setTimeLock(timestamp);
  setUnlockDate(date.toISOString());  // send ISO string to backend
  setShowTimeLockModal(false);
}}

      />
    </motion.form>
  );
}
