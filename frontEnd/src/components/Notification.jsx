import PropTypes from "prop-types";
import { CheckCircle, Clock, Unlock, Info, BellDot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import axios from "../api/axiosInstance";

export default function NotificationList({ notifications, setNotifications }) {
  if (!notifications || notifications.length === 0) {
    return <p className="text-sm text-gray-400">No notifications yet.</p>;
  }

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete("/notifications/all");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  return (
    <>
      {/* 🔴 Clear Button at the Top */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear All Notifications
        </button>
      </div>

      <ul className="space-y-4">
        {notifications.map((notif) => {
          const timeAgo = formatDistanceToNow(new Date(notif.createdAt), {
            addSuffix: true,
          });

          const getTypeDetails = (type) => {
            switch (type) {
              case "capsule_unlock":
                return {
                  icon: <Unlock className="text-blue-400 w-5 h-5" />,
                  bg: "bg-blue-900/20",
                };
              case "capsule_minted":
                return {
                  icon: <CheckCircle className="text-green-400 w-5 h-5" />,
                  bg: "bg-green-900/20",
                };
              case "reminder":
                return {
                  icon: <Clock className="text-yellow-400 w-5 h-5" />,
                  bg: "bg-yellow-900/20",
                };
              default:
                return {
                  icon: <Info className="text-purple-400 w-5 h-5" />,
                  bg: "bg-purple-900/20",
                };
            }
          };

          const { icon, bg } = getTypeDetails(notif.type);

          return (
            <li
              key={notif._id}
              onClick={() => handleMarkAsRead(notif._id)}
              className={`cursor-pointer flex items-start gap-3 p-4 rounded-md border border-neutral-700 ${bg} hover:bg-opacity-40 transition`}
            >
              <div className="relative">
                {icon}
                {!notif.read && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-400 rounded-full animate-ping"></span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-white">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
              </div>

              {!notif.read && (
                <BellDot className="text-blue-400 w-4 h-4 opacity-70 mt-1" />
              )}
            </li>
          );
        })}
      </ul>
      
    </>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  
  setNotifications: PropTypes.func.isRequired,
};
