import NFTCard from "./NFTCard";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";


export default function NFTGallery({ nfts }) {
  const navigate = useNavigate();

  if (!Array.isArray(nfts) || nfts.length === 0) {
    return <p className="text-gray-400 text-sm mt-4">No NFTs to display.</p>;
  }
  const handleView = (nft) => {
    navigate(`/nft/${nft.capsuleId}`);
  };

  const handleInherit = (nft) => {
    console.log("Inherit requested:", nft);
    if (onInherit) onInherit(nft);
  };

  const handleTransfer = (nft) => {
    console.log("Transfer requested:", nft);
    if (onTransfer) onTransfer(nft);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <NFTCard
        key={nft.id || nft.tokenId || nft.mintTxHash}
          nft={nft}
          onView={() => handleView(nft)}
          onInherit={() => handleInherit(nft)}
          onTransfer={() => handleTransfer(nft)}
        />
      ))}
    </div>
  );
};

NFTGallery.propTypes = {
  nfts: PropTypes.arrayOf(
    PropTypes.shape({
      tokenId: PropTypes.string.isRequired,
      capsuleId: PropTypes.string.isRequired,

    })
  ).isRequired
};
