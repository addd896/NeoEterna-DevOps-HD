import PropTypes from "prop-types";
import { ShieldCheck, ShieldX, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function VerificationBadge({ status, confidence }) {
  const isAuthentic = status === "authentic";
  const isForgery = status === "forgery";

  const icon = isAuthentic ? (
    <ShieldCheck className="w-5 h-5 text-green-400" />
  ) : isForgery ? (
    <ShieldX className="w-5 h-5 text-red-400" />
  ) : (
    <Info className="w-5 h-5 text-yellow-400" />
  );

  const bgColor = isAuthentic
    ? "bg-green-900/30"
    : isForgery
    ? "bg-red-900/30"
    : "bg-yellow-900/30";

  const barColor = isAuthentic
    ? "bg-green-500"
    : isForgery
    ? "bg-red-500"
    : "bg-yellow-500";

  const textColor = isAuthentic
    ? "text-green-400"
    : isForgery
    ? "text-red-400"
    : "text-yellow-400";

  const label = isAuthentic
    ? "File is Authentic ✅"
    : isForgery
    ? "Tampering Detected ⚠️"
    : "Uncertain ⚠️";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group flex flex-col gap-2 px-4 py-3 rounded-lg ${bgColor} border border-neutral-700 w-full max-w-md`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className={`font-medium text-sm ${textColor}`}>{label}</p>
          <p className="text-xs text-white/80">Confidence: {Math.round(confidence)}%</p>
        </div>

        <div className="relative ml-auto">
          <Info className="w-4 h-4 text-white opacity-50 group-hover:opacity-100 cursor-pointer" />
          <div className="absolute hidden group-hover:flex flex-col bg-black text-xs text-white px-3 py-2 rounded-lg shadow-md top-full mt-2 right-0 z-10 w-max">
            <span>Confidence Score: {Math.round(confidence)}%</span>
            <span>Model: EfficientNetB0</span>
          </div>
        </div>
      </div>

      {/* Confidence Progress Bar */}
      <div className="w-full bg-neutral-700 h-3 rounded-full overflow-hidden">
        <div
          className={`${barColor} h-full transition-all`}
          style={{ width: `${Math.round(confidence)}%` }}
        ></div>
      </div>
    </motion.div>
  );
}

VerificationBadge.propTypes = {
  status: PropTypes.oneOf(["authentic", "forgery", "uncertain"]).isRequired,
  confidence: PropTypes.number.isRequired,
};
