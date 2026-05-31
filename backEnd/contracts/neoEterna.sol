// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract neoEterna is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable
{
    struct Capsule {
        uint256 unlockTimestamp;
        string encryptedDataURI;
        string title;
        string description;
        string category;
        address heir;
        string fileHash;
        uint256 lastInteraction;
    }

    mapping(uint256 => Capsule) private capsules;
    uint256 private _tokenIds;

    event CapsuleCreated(
        uint256 tokenId,
        address owner,
        uint256 unlockTimestamp,
        string encryptedDataURI,
        string title,
        string description,
        string category,
        address heir
    );

    event CapsuleOpened(uint256 tokenId, address owner, string decryptedDataURI);
    event CapsuleTransferredToHeir(uint256 tokenId, address previousOwner, address newOwner);

    constructor() ERC721("TimeCapsuleNFT", "TCN") Ownable(msg.sender) {}

    function mintCapsule(
        string memory _encryptedDataURI,
        uint256 _unlockTimestamp,
        string memory _title,
        string memory _description,
        string memory _category,
        address _heir,
        string memory _fileHash
    ) public returns (uint256) {
        require(_unlockTimestamp > block.timestamp, "Unlock date must be in the future");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _encryptedDataURI);

        capsules[newTokenId] = Capsule(
            _unlockTimestamp,
            _encryptedDataURI,
            _title,
            _description,
            _category,
            _heir,
            _fileHash,
            block.timestamp
        );

        emit CapsuleCreated(
            newTokenId,
            msg.sender,
            _unlockTimestamp,
            _encryptedDataURI,
            _title,
            _description,
            _category,
            _heir
        );

        return newTokenId;
    }

    function getFileHash(uint256 tokenId) public view returns (string memory) {
        return capsules[tokenId].fileHash;
    }

    function getCapsule(uint256 tokenId)
        public
        view
        returns (
            uint256 unlockTimestamp,
            string memory encryptedDataURI,
            string memory title,
            string memory description,
            string memory category,
            address heir,
            string memory fileHash,
            uint256 lastInteraction
        )
    {
        Capsule memory c = capsules[tokenId];
        return (
            c.unlockTimestamp,
            c.encryptedDataURI,
            c.title,
            c.description,
            c.category,
            c.heir,
            c.fileHash,
            c.lastInteraction
        );
    }

    function openCapsule(uint256 tokenId, string memory _decryptionKey) public view returns (string memory) {
        require(ownerOf(tokenId) == msg.sender, "You do not own this capsule");
        require(block.timestamp >= capsules[tokenId].unlockTimestamp, "Capsule is still locked");

        return string(abi.encodePacked("Decrypted: ", capsules[tokenId].encryptedDataURI, " with key: ", _decryptionKey));
    }

    function updateInteraction(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You do not own this capsule");
        capsules[tokenId].lastInteraction = block.timestamp;
    }

    function transferToHeir(uint256 tokenId) public {
        require(capsules[tokenId].heir != address(0), "No heir assigned");
        require(block.timestamp > capsules[tokenId].lastInteraction + 365 days, "Owner is still active");

        address previousOwner = ownerOf(tokenId);
        address newOwner = capsules[tokenId].heir;
        _transfer(previousOwner, newOwner, tokenId);

        emit CapsuleTransferredToHeir(tokenId, previousOwner, newOwner);
    }

     // ************* Overrides *************

    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}