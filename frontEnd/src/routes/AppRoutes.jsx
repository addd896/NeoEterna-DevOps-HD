import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateCapsule from "../pages/CreateCapsule";
import CapsuleDetail from "../pages/CapsuleDetail";
import NFTDetail from "../pages/NFTDetail";
import Profile from "../pages/Profile";
import AdminPanel from "../pages/AdminPanel";
import Help from "../pages/Help";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import { useAuth } from "../context/AuthContext";

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
      <Route path="/create" element={token ? <CreateCapsule /> : <Login />} />
      <Route path="/capsule/:id" element={<CapsuleDetail />} />
      <Route path="/nft/:id" element={<NFTDetail />} />
      <Route path="/profile" element={token ? <Profile /> : <Login />} />
      <Route path="/admin" element={token ? <AdminPanel /> : <Login />} />
      <Route path="/help" element={<Help />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
