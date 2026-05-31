import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { formatDistanceToNow } from "date-fns";

export default function AdminPanel() {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [flaggedCapsules, setFlaggedCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [auditRes, statsRes, flaggedRes] = await Promise.all([
          axios.get("/admin/audit"),
          axios.get("/admin/stats"),
          axios.get("/storage/flagged")
        ]);

        setLogs(auditRes.data || []);
        setStats(statsRes.data || {});
        setFlaggedCapsules(flaggedRes.data || []);
      } catch (err) {
        console.error("Admin access error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAdmin, navigate]);

  const handleBan = async (address) => {
    try {
      await axios.post("/admin/ban", { walletAddress: address });
      alert(`🚫 Wallet ${address} has been banned.`);
    } catch (err) {
      console.error("Ban failed:", err);
    }
  };

  const handleFlag = async (capsuleId) => {
    const reason = prompt("Enter a reason for flagging this capsule:");
    if (!reason) return;
    try {
      await axios.post("/admin/flag", { capsuleId, reason });
      alert(`🚩 Capsule ${capsuleId} has been flagged.`);
    } catch (err) {
      console.error("Flagging failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-red-400 mb-8">🛡️ Admin Panel</h1>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Capsules" value={stats.capsulesStored} />
          <StatCard label="Users" value={stats.users} />
          <StatCard label="Gas Used" value={stats.gasUsed || 0} />
          <StatCard label="Verification Success" value={`${stats.verificationRate || 0}%`} />
        </div>

        {/* Flagged Capsules */}
        {flaggedCapsules.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">🚩 Flagged Capsules</h2>
            <ul className="space-y-2">
              {flaggedCapsules.map((cap) => (
                <li key={cap._id} className="border border-yellow-500 p-4 rounded bg-yellow-900">
                  <p><strong>Title:</strong> {cap.title}</p>
                  <p><strong>Reason:</strong> {cap.flaggedReason || "N/A"}</p>
                  <p><strong>Owner:</strong> {cap.owner}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Audit Logs */}
        <h2 className="text-xl font-semibold mb-4">📌 Activity Logs</h2>
        <div className="overflow-x-auto rounded border border-neutral-700">
          <table className="w-full text-sm">
            <thead className="bg-neutral-800">
              <tr>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Wallet</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t border-neutral-700 hover:bg-neutral-800">
                  <td className="p-3 text-white">{log.event}</td>
                  <td className="p-3 text-sm text-dodgerblue">{log.wallet}</td>
                  <td className="p-3 text-sm text-gray-400">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleBan(log.wallet)}
                    >
                      Ban
                    </button>
                    {log.capsuleId && (
                      <button
                        className="text-xs px-2 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400"
                        onClick={() => handleFlag(log.capsuleId)}
                      >
                        Flag
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value }) => (
  <div className="bg-neutral-800 p-4 rounded-lg text-center shadow-md">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-xl font-bold text-white">{value ?? 0}</p>
  </div>
);
