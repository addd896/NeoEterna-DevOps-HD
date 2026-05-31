import PropTypes from "prop-types";

const Usecases = ({ className = "" }) => {
  return (
    <section className={`w-full bg-black text-white py-20 px-6 md:px-16 ${className}`}>
      <h2 className="text-dodgerblue text-5xl md:text-6xl font-elsie mb-12 text-center">
        ENTERPRISE USECASES:
      </h2>

      <div className="max-w-5xl mx-auto space-y-12 text-lg md:text-2xl leading-relaxed">
        <div>
          <h3 className="font-bold text-white mb-2">👩‍👧‍👦 Individuals & Families</h3>
          <p>
            Preserve personal memories, messages, and heirlooms for future generations.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">💼 Legal & Business Professionals</h3>
          <p>
            Time-sealed digital wills, contracts, and tamper-proof legal documents.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">🎨 Artists & Content Creators</h3>
          <p>
            Secure NFT licensing and AI-backed anti-forgery verification.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">🧬 Researchers & Academics</h3>
          <p>
            Immutable academic storage, timestamped findings, and IP protection.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">📜 Governments & Institutions</h3>
          <p>
            Public record transparency and tamper-proof historical archives.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-2">🌐 Web3 & Blockchain Enthusiasts</h3>
          <p>
            Real-world NFT utility, decentralized data ownership, and trustless tech.
          </p>
        </div>
      </div>
    </section>
  );
};

Usecases.propTypes = {
  className: PropTypes.string,
};

export default Usecases;
