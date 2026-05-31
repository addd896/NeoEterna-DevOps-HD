import CapsuleCard from "./CapsuleCard";
import { useNavigate } from "react-router-dom";

const CapsuleGallery = ({ capsules, onView, onMint, onDelete }) => {
const navigate = useNavigate();

  if (!Array.isArray(capsules) || capsules.length === 0) {
    return <p className="text-gray-400 text-sm mt-4">No capsules available.</p>;
  }

  const handleView = (capsule) => {
    navigate(`/capsule/${capsule._id}`);
  }; 
  const handleMint= (capsule) => {
    if (onMint) onDelete(capsule._id);
  };
  
  const handleDelete = (capsule) => {
    if (onDelete) onDelete(capsule._id);
  };
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {capsules.map((capsule) => (
        <CapsuleCard
         key={capsule._id} 
         capsule={capsule} 
         onView={() => handleView(capsule)} 
         onMint={() => handleMint(capsule)} 
         onDelete={() => handleDelete(capsule)}
         />
      ))}
    </div>
  );
};

export default CapsuleGallery;
