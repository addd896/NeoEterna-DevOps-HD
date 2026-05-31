import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserInfo from "../components/UserInfo";
import WalletLogin from "../components/WalletLogin";
import CapsuleGallery from "../components/CapsuleGallery";
import NFTGallery from "../components/NFTGallery";
import Notification from "../components/Notification";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { token, user, walletAddress } = useAuth();
  const navigate = useNavigate();

  const [capsules, setCapsules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [inherited, setInherited] = useState([]);
  const [transferred, setTransferred] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [capsuleRes, notifRes] = await Promise.all([
        axios.get("/storage/user/capsules"),
        axios.get("/notifications/user")
      ]);

      setCapsules(capsuleRes.data.capsules);
      setNotifications(notifRes.data.notifications);

      if (walletAddress) {
        const nftRes = await axios.get(`/nft/${walletAddress}`);
        const all = Array.isArray(nftRes.data) ? nftRes.data : (nftRes.data.nfts || []);

        setNfts(all.filter(n => !n.isInherited && !n.isTransferred));
        setInherited(all.filter(n => n.isInherited));
        setTransferred(all.filter(n => n.isTransferred));

        console.log("🎯 Fetched NFTs:", all);
        console.log("🎯 Your NFTs:", all.filter(nft => !nft.isInherited && !nft.isTransferred));
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchDashboard();
  }, [token]);

  const handleMint = async (id) => {
    if (!walletAddress) {
      alert("🔐 Please connect your wallet to mint this capsule.");
      return;
    }
    try {
      await axios.post(`/capsules/mint/${id}`);
      toast.success("🎉 Capsule minted!");
      fetchDashboard();
    } catch (err) {
      toast.error("Mint failed.");
      console.error("Mint error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/capsules/${id}`);
      setCapsules(prev => prev.filter(c => c._id !== id));
      toast.success("🗑️ Capsule deleted.");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const handleView = (capsule) => navigate(`/capsule/${capsule._id}`);

  if (loading) {
    return <div className="text-white p-6">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">NeoEterna Dashboard</h1>

<div className="flex flex-wrap gap-4 mb-8">
  <button
    onClick={() => navigate("/profile")}
    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-white"
  >
    👤 Profile
  </button>

  {user?.role === "admin" && (
    <button
      onClick={() => navigate("/admin")}
      className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white"
    >
      🛡️ Admin Panel
    </button>
  )}

  <button
    onClick={() => {
      localStorage.clear();
      window.location.href = "/login";
    }}
    className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-400 text-black"
  >
    🚪 Logout
  </button>
</div>


      {walletAddress ? (
        <p className="text-sm text-green-400 mb-4">
          🔗 Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-yellow-400">⚠️ No wallet connected</p>
          <WalletLogin />
        </div>
      )}

      <UserInfo user={user} />

      <button
        onClick={() => navigate("/create")}
        className="mt-4 px-4 py-2 bg-neon-purple text-black rounded hover:bg-neon-blue transition"
      >
        + Create Capsule
      </button>

      {/* Capsules */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Your Capsules</h2>
        <CapsuleGallery
          capsules={capsules.filter(c => !c.mintTxHash)}
          onView={handleView}
          onMint={handleMint}
          onDelete={handleDelete}
        />
      </section>

      {/* Notifications */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Notifications</h2>
        <Notification notifications={notifications} setNotifications={setNotifications} />
      </section>

      {/* NFTs */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">NFT Gallery</h2>

        <h3 className="text-lg font-medium mt-4 mb-2">Owned NFTs</h3>
        {nfts.length ? <NFTGallery nfts={nfts} /> : <p className="text-gray-500">No NFTs yet.</p>}

        <h3 className="text-lg font-medium mt-4 mb-2">Inherited NFTs</h3>
        {inherited.length ? <NFTGallery nfts={inherited} /> : <p className="text-gray-500">No inherited NFTs.</p>}

        <h3 className="text-lg font-medium mt-4 mb-2">Transferred NFTs</h3>
        {transferred.length ? <NFTGallery nfts={transferred} /> : <p className="text-gray-500">No transferred NFTs.</p>}
      </section>
    </div>
  );
};

export default Dashboard;
