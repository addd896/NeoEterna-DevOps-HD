// pages/Register.jsx
import Registration from '../components/Registration';
import finalLogo from '../assets/finalLogo.png';

export default function Register() {
  return(
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <img src={finalLogo} alt="NeoEterna Logo" className="w-36 mb-6" />
  
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-dodgerblue mb-4">
          Welcome to NeoEterna
        </h1>
        <p className="text-sm text-gray-400 mb-8">
        Create your account to preserve and protect your digital legacy with NeoEterna.
        </p>

   <Registration />;
   </div>
);
}