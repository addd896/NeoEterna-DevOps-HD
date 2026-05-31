import Navbar from "../components/Navbar";

export default function Help() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-dodgerblue mb-6">🆘 Help & FAQ</h1>

        {/* Section: Getting Started */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">🚀 Getting Started</h2>
          <p className="text-gray-300 mb-2">
            To use NeoEterna, connect your wallet using MetaMask or log in with your email. Once you're in, you can upload a file, verify its authenticity, mint it as an NFT, and set a time-lock for future access.
          </p>
          <p className="text-gray-300">
            Go to <strong>/create</strong> to upload a new capsule or <strong>/dashboard</strong> to view your existing ones.
          </p>
        </div>

        {/* Section: Common Questions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">❓ Common Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neon-purple">What is a digital time capsule?</h3>
              <p className="text-gray-400">
                A digital time capsule is an encrypted file stored on decentralized storage (Arweave) and secured by blockchain. It can be locked until a future date using smart contracts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neon-purple">How does the AI verification work?</h3>
              <p className="text-gray-400">
                We use a pre-trained model (EfficientNetB0) to detect tampering or forgery in your documents, images, or videos. It gives a confidence score before your file is minted.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neon-purple">What happens if I lose my wallet?</h3>
              <p className="text-gray-400">
                Your NFTs are tied to your wallet. If you lose access, recovery depends on your wallet provider. We recommend setting up inheritance options via smart contracts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-neon-purple">Can I delete a capsule?</h3>
              <p className="text-gray-400">
                No. Once a capsule is uploaded and minted, it lives forever on the blockchain and Arweave. You can, however, hide or revoke access to its metadata.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-3">📬 Need more help?</h2>
          <p className="text-gray-300">
            Reach out to our team via <a href="mailto:support@neoeterna.io" className="text-neon-purple underline">support@neoeterna.io</a> or join our Discord community.
          </p>
        </div>
      </div>
    </div>
  );
}
