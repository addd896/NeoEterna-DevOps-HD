import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import finalLogo from "../assets/finalLogo.png";

export default function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
      {/* Glowing Background Orbs */}
      <div className="absolute top-1/4 -left-12 w-48 h-48 rounded-full bg-[#F72585] opacity-20 blur-[100px]" />
      <div className="absolute bottom-1/4 -right-12 w-48 h-48 rounded-full bg-[#4361EE] opacity-20 blur-[100px]" />
      <img src={finalLogo} alt="NeoEterna Logo" className="w-96 h-auto mb-6" />

      {/* Title */}
      <motion.h1
        className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
       What is ᑎ☰ ?
      </motion.h1>
    
      {/* Subtitle */}
      <motion.p
        className="text-xl max-w-4xl md:text-xl font-light leading-relaxed text-slate-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        NE (NeoEterna) = Your legacy. Verified by AI. Locked on-chain. Timed for the future.
      </motion.p>

    </section>
  );
}
