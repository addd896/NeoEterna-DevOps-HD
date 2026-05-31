import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axiosInstance";

export default function Profile() {
  const { token, walletAddress } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    currentPassword: "",
    newPassword: "",
    notifications: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !walletAddress) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;
        setProfile(user);
        setSettings((prev) => ({
          ...prev,
          notifications: user.notificationPreferences?.notifications ?? true,
        }));
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, walletAddress, navigate]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    const updates = {};
    let somethingToUpdate = false;

    if (settings.currentPassword && settings.newPassword) {
      if (settings.newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
      updates.oldPassword = settings.currentPassword;
      updates.newPassword = settings.newPassword;
      somethingToUpdate = true;
    }

    if (
      typeof profile?.notificationPreferences?.notifications !== "undefined" &&
      profile.notificationPreferences.notifications !== settings.notifications
    ) {
      updates.notificationPreferences = {
        notifications: settings.notifications,
      };
      somethingToUpdate = true;
    }

    if (!somethingToUpdate) {
      alert("⚠️ No changes made.");
      return;
    }

    try {
      await axios.patch("/user/settings", updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Settings updated");
      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      console.error("❌ Failed to update settings:", err);
      alert("❌ Failed to update settings");
    }
  };

  const handleToggleNotifications = () => {
    setSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-dodgerblue mb-6">👤 Profile</h1>

        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-neutral-700 space-y-4">
          <p>
            <span className="font-semibold text-gray-400">Wallet:</span>{" "}
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </p>
          <p>
            <span className="font-semibold text-gray-400">Email:</span>{" "}
            {profile?.email || "Not linked"}
          </p>
          <p>
            <span className="font-semibold text-gray-400">Joined:</span>{" "}
            {new Date(profile?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold text-gray-400">Capsules Created:</span>{" "}
            {profile?.capsules?.length || 0}
          </p>
          <p>
            <span className="font-semibold text-gray-400">NFTs Owned:</span>{" "}
            {profile?.nfts?.length || 0}
          </p>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  readOnly
                  className="w-full px-4 py-2 bg-neutral-800 border border-gray-600 rounded-md text-sm text-white opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-neutral-900 border border-gray-600 rounded-md text-sm text-white"
                  value={settings.currentPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, currentPassword: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-neutral-900 border border-gray-600 rounded-md text-sm text-white"
                  value={settings.newPassword}
                  onChange={(e) =>
                    setSettings({ ...settings, newPassword: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">🔔 Notifications</p>
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    settings.notifications
                      ? "bg-green-500 text-black hover:bg-green-400"
                      : "bg-gray-600 text-white hover:bg-gray-500"
                  }`}
                >
                  {settings.notifications ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
