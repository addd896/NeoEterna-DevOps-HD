import PropTypes from "prop-types";

const Footer = ({ className = "" }) => {
  return (
    <footer
      className={`w-full bg-[#0f0f0f] text-white py-10 px-6 ${className}`}
      id="footer"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        {/* Branding */}
        <div>
          <p className="text-purple-400 text-xl md:text-2xl font-semibold">
            &copy; {new Date().getFullYear()} NeoEterna. All rights reserved.
          </p>
          <p className="text-gray-400 text-base mt-1">Preserve. Prove. Pass On.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm md:text-base text-gray-300">
          <a href="#" className="hover:text-purple-400 transition duration-200">About</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition duration-200">GitHub</a>
          <a href="#" className="hover:text-purple-400 transition duration-200">Privacy</a>
          <a href="#" className="hover:text-purple-400 transition duration-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
