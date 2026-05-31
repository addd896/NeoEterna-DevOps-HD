import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VerificationBadge from "../components/VerificationBadge";
import axios from "../api/axiosInstance";
import { fetchCapsuleDetail } from "../api/capsuleDetailService";

export default function CapsuleDetail() {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCapsule = async () => {
    try {
      const response = await fetchCapsuleDetail(id);
      setCapsule(response);
    } catch (err) {
      console.error("❌ Failed to fetch capsule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCapsule();

    const interval = setInterval(() => {
      if (!capsule?.confirmed) getCapsule();
    }, 30000); // auto-refresh every 30s

    return () => clearInterval(interval);
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await axios.get(`/capsules/unlock/${id}`, {
        responseType: "blob",
      });
  
      const contentDisposition = res.headers["content-disposition"];
      let filename = "capsule.bin";

      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition
          .split("filename=")[1]
          .replace(/"/g, "")
          .trim();
      }
  
      const blob = new Blob([res.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("❌ Failed to download capsule. Try again.");
    }
  };  

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-gray-400">Loading capsule...</p>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-red-500">Capsule not found.</p>
      </div>
    );
  }

  const {
    title,
    description,
    unlockTimestamp,
    mintTxHash,
    owner,
    aiStatus,
    aiConfidence,
    miningStatus,
    fileURL,
    unlocked
  } = capsule;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mb-6">
     <button
    onClick={() => window.location.href = "/dashboard"}
    className="text-sm px-4 py-2 bg-neon-purple text-black rounded hover:bg-neon-blue transition"
  >
    ← Back to Dashboard
  </button>
</div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-dodgerblue mb-4">Capsule Title: {title}</h1>

        <p className="text-sm text-gray-400 mb-4">
          <span className="font-semibold">Mint TX:</span>{" "}
          {mintTxHash || "Not minted"}
          <br />
          <span className="font-semibold">Owner:</span>{" "}
          {owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : "N/A"}
          <br />
          <span className="font-semibold">Unlocks:</span>{" "}
          {unlockTimestamp
            ? new Date(unlockTimestamp * 1000).toLocaleString()
            : "No time lock"}
        </p>

        {aiStatus && (
          <VerificationBadge status={aiStatus} confidence={aiConfidence} />
        )}

        <div className="mt-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-300">{description}</p>
        </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-white">File</h2>
          
             {!unlocked ? (
             <p className="text-sm text-yellow-400">
               No file preview available.<br />
              🔒 This capsule is locked until {new Date(unlockTimestamp * 1000).toLocaleString()} 
              and cannot be accessed yet.
              </p>
             ) : miningStatus !== "Confirmed" ? (
            <p className="text-sm text-yellow-400">
             ⛓️ Waiting for on-chain confirmation. Your file is not yet mined on Arweave.<br />
             Please check after sometime.
          </p>
          ) : (
          <button onClick={handleDownload}
            className="text-neon-purple underline hover:text-neon-blue transition">
            Download Capsule
            </button>
          )}
      </div>
    </div>
    </div>
  );
}
