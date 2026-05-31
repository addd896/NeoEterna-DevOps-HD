import PropTypes from "prop-types";
import storyImg from "../assets/neoEterna.png";
import capsuleImg from "../assets/capsule.jpg";

const Body = ({ className = "" }) => {
  return (
    <section className={`relative w-full bg-black px-6 py-20 text-left text-white ${className}`}>
      {/* OUR STORY */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
        <div className="lg:w-1/2">
          <h2 className="text-5xl font-elsie text-dodgerblue underline mb-6">OUR STORY</h2>
          <div className="space-y-4 text-lg leading-relaxed">
          <p className="m-0">
            In the early days of the digital era, we saved memories on fragile devices — USB drives, cloud accounts, forgotten folders.
          </p>
          
          <p className="m-0">
            But the truth is: data fades. Platforms vanish. People lose access.
          </p>
         
          <p className="m-0">
            At NeoEterna, we saw the need for something greater. A system that doesn't just store, but preserves. One that doesn't just protect, but proves. A vault not for files— but for legacies.
          </p>
          
            <p className="m-0">
            Born from our passion for digital permanence, we set out to combine the immutability of blockchain, the intelligence of AI, and the resilience of decentralized storage — to create time capsules that cannot be erased, altered, or forgotten.
          </p>
      
            <p className="m-0">
            Whether it's a message to your future child, a will to unlock decades from now, or an artwork you want to protect beyond your lifetime — NeoEterna is your bridge to forever.
          </p>
          </div>
        </div>
        <img src={storyImg} alt="NeoEterna Illustration" className="lg:w-1/2 w-full max-w-lg rounded-xl shadow-lg" />
      </div>

      {/* OUR MISSION and VISION*/}
      <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-12 mb-24">
      <img src={capsuleImg} alt="Time Capsule" className="lg:w-1/2 w-full max-w-lg rounded-xl shadow-lg" />

      <div className="lg:w-1/2">

      <h2 className="text-5xl font-elsie text-dodgerblue underline mb-6">OUR MISSION</h2>
      <p className="m-0">
          Secure memories. Verify truth. Preserve forever.
          </p>
          </div>
          </div>
      <div className="flex flex-col items-start lg:items-center text-center">
        <h2 className="text-5xl font-elsie text-dodgerblue underline mb-6">OUR VISION</h2>
        <p className="m-0">
          A world where memories outlive time.
          </p>
      </div>
        </section>
      );
    };


Body.propTypes = {
  className: PropTypes.string,
};

export default Body;

