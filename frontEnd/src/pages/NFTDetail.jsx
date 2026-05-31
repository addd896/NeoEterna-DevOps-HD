import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import VerificationBadge from "../components/VerificationBadge";
import { Lock, Unlock, CalendarDays, ArrowLeft } from "lucide-react";
import { fetchNFTDetail } from "../api/nftDetailService";

export default function NftDetail() {
  const { id } = useParams();
  const [nft, setNFT] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getNFT = async () => {
    try {
      const response = await fetchNFTDetail(id);
      console.log("🎯 NFT fetched:", response); 
      setNFT(response);
    } catch (err) {
      console.error("❌ Failed to fetch capsule:", err);
      setNFT(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNFT();

    const interval = setInterval(() => {
      if (!nft?.confirmed) getNFT();
    }, 30000); // auto-refresh every 30s

    return () => clearInterval(interval);
  }, [id]);

  const handleDownload = async () => {
    try {
      const downloadId = nft?.tokenId || nft?.mintTxHash || nft?._id;

      if (!downloadId) {
    alert("⚠️ Cannot download NFT. Missing token ID.");
    return;
  }

      const res = await axios.get(`/nft/unlock/${downloadId}`, {
        responseType: "blob",
      });
  
      const contentDisposition = res.headers["content-disposition"];
      let filename = "nft.bin";

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
        <p className="text-gray-400">Loading NFT details...</p>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-red-500">NFT not found.</p>
      </div>
    );
  }

  const {
    title,
    description,
    owner,
    unlockTimestamp,
    aiStatus,
    aiConfidence,
    miningStatus,
    fileURL,
    tokenId,
    mintTxHash = tokenId, 
  } = nft;
  const isUnlocked = unlockTimestamp <= Math.floor(Date.now() / 1000);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-neon-purple hover:underline mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back
        </button>

       <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-dodgerblue mb-4">Capsule Title: {title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          <span className="font-semibold">Mint Token ID:</span> {tokenId || "N/A"}</p>
          <p>
           <span className="font-semibold">Mint:</span>{" "}
            {mintTxHash ? (
             <span className="text-green-400">✅ Minted</span>
             ) : (
            <span className="text-yellow-400">⏳ Not Minted Yet</span>
            )}
            </p>

        {aiStatus && (
          <VerificationBadge status={aiStatus} confidence={aiConfidence} />
        )}

          <p><span className="font-semibold">Owner:</span> {owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : "N/A"}</p>
          <p>
            <span className="font-semibold">Unlocks:</span>{" "}
            {unlockTimestamp ? new Date(unlockTimestamp * 1000).toLocaleString() : "No lock"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {isUnlocked ? (
              <span className="text-green-400">✅ Unlocked</span>
            ) : (
              <span className="text-yellow-400">🔒 Locked</span>
            )}
          </p>
        </div>

       <div className="my-6">
           <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300">{description}</p>
         </div>

             {!isUnlocked ? (
             <p className="text-sm text-yellow-400">
               No file preview available.<br />
              🔒 This capsule is locked until {new Date(unlockTimestamp * 1000).toLocaleString()} 
              and cannot be accessed yet.
              </p>
             ):(
          <button onClick={handleDownload}
            className="text-neon-purple underline hover:text-neon-blue transition">
            Download NFT
            </button>
          )}
      </div>
    </div>

  );
}


