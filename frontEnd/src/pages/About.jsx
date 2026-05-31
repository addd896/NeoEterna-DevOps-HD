import Navbar from "../components/Navbar";
import finalLogo from "../assets/finalLogo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={finalLogo} alt="NeoEterna Logo" className="w-36 h-auto" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-dodgerblue mb-4 text-center">
          About NeoEterna
        </h1>

        {/* Intro */}
        <p className="text-gray-300 text-lg mb-6 text-center max-w-2xl mx-auto">
          NeoEterna is a decentralized digital time capsule platform designed to preserve memories, documents, and legacies — immutably and securely — for future generations.
        </p>

        {/* Mission */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">🚀 Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            We're redefining digital permanence. NeoEterna empowers users to upload files, validate their authenticity using AI, mint them as NFTs for verifiable ownership, and time-lock them on the blockchain until a chosen future date.
          </p>
        </section>

        {/* Tech Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">⚙️ Technology Stack</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>⛓️ Ethereum / Polygon (Smart Contracts + NFT minting)</li>
            <li>🧠 EfficientNetB0 (AI-based forgery detection)</li>
            <li>🗄️ Bundlr + Arweave (decentralized storage)</li>
            <li>🧰 React, Tailwind CSS, Framer Motion (frontend)</li>
            <li>🌐 FastAPI + MongoDB Atlas (backend & DB)</li>
          </ul>
        </section>

        {/* Creator (Optional) */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">👩‍💻 Built By</h2>
          <p className="text-gray-400">
            This project was created by Riya Dabas as a final year BSc Computer Science dissertation project — blending innovation, security, and purpose into a tool for digital legacy preservation.
          </p>
        </section>

        {/* Outro */}
        <p className="text-center text-gray-500 mt-10">
          Have questions? Visit our <a href="/help" className="text-neon-purple underline">Help Page</a>.
        </p>
      </div>
    </div>
  );
}
