import PropTypes from "prop-types";

const Steps = ({ className = "" }) => {
  return (
    
    <section className={`w-full bg-black text-white py-20 px-6 md:px-16 ${className}`}>
      <h2 className="text-5xl text-dodgerblue font-bold mb-12">HOW IT WORKS?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div>
            <div className="text-6xl">📤</div>
            <h3 className="text-3xl text-dodgerblue mt-4 mb-2">Upload & Encrypt</h3>
            <p>Select your digital file. It’s encrypted locally before processing.</p>
          </div>
          {/* Step 2 */}
          <div>
            <div className="text-6xl">🤖</div>
            <h3 className="text-3xl text-dodgerblue mt-4 mb-2">AI Verification</h3>
            <p>We use pre-trained models to scan for forgery, tampering, or manipulation.</p>
          </div>
          {/* Step 3 */}
          <div>
            <div className="text-6xl">⛓️</div>
            <h3 className="text-3xl text-dodgerblue mt-4 mb-2">Mint NFT Capsule</h3>
            <p>Your encrypted file is linked to a blockchain-based NFT proving ownership.</p>
          </div>
          
          {/* Step 4 */}
          <div>
            <div className="text-6xl">⏳</div>
            <h3 className="text-3xl text-dodgerblue mt-4 mb-2">Time-Lock & Store</h3>
            <p>You set the unlock date. We store it permanently on Arweave using Bundlr.</p>
          </div>
        </div>
      </section>
  )
};

Steps.propTypes = {
    className: PropTypes.string,
  };
  
  export default Steps;
  