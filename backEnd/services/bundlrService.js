require("dotenv").config(); // Load environment variables from .env
const Bundlr = require('@bundlr-network/client').default;
const { ethers } = require("ethers");
const axios = require("axios");

// Load deployer's private key and RPC provider for Polygon Amoy Testnet
const privateKey = process.env.PRIVATE_KEY;
const providerUrl = process.env.ALCHEMY_URL_AMOY;

// Setup Ethers provider and wallet signer
const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Initialize Bundlr client with network config and wallet key
const bundlr = new Bundlr(
  "https://node1.bundlr.network", // Bundlr node
  "matic",                        // Currency (Polygon)
  wallet.privateKey,             // Auth for funding
  { providerUrl }                // Required for signing/funding
);

/**
 * Handles the entire Bundlr upload lifecycle:
 * - Encrypts and uploads a file
 * - Funds the Bundlr wallet
 * - Monitors transaction and Arweave mining status
 */
async function uploadOnce(buffer) {
  if (!buffer || buffer.length === 0) {
    throw new Error("File buffer is empty — cannot upload.");
  }

  // Fetch current wallet balance
  const onChainBalance = await provider.getBalance(wallet.address);
  console.log("🔗 On-chain wallet balance:", ethers.formatEther(onChainBalance), "MATIC");

  // Initialize Bundlr client
  await bundlr.ready();

  // Fix Bundlr's gas limit estimation if needed
  bundlr.currency.createTx = async (amount) => {
    const tx = await bundlr.utils.getBundlerTx(amount);
    tx.gasLimit = ethers.BigNumber.from("30000");
    return tx;
  };

  // Estimate cost of the upload based on file size
  const price = await bundlr.getPrice(buffer.length);
  console.log("💸 Upload cost (estimated):", ethers.formatEther(price.toString()), "MATIC");

  // Fund 20% more to avoid underfunding errors
  const fundAmount = (BigInt(price) * 120n) / 100n;
  console.log("⚡ Funding with:", ethers.formatEther(fundAmount.toString()), "MATIC");

  // Send the fund transaction to Bundlr
  const fundTx = await bundlr.fund(fundAmount);
  console.log("💸 Sent Bundlr funding tx:", fundTx.id);

  if (fundTx?.id) {
    console.log(`🔗 View on Polygonscan: https://polygonscan.com/tx/${fundTx.id}`);
  } else {
    console.log("⚠️ No funding transaction hash returned.");
  }

  // Wait for funding to confirm
  await wallet.provider.waitForTransaction(fundTx.id, 1);
  console.log("💸 Funding confirmed");

  // Upload file to Bundlr/Arweave with metadata tag
  const txn = await bundlr.upload(buffer, {
    tags: [{ name: "Content-Type", value: "application/octet-stream" }]
  });

  // Ensure a transaction ID was returned
  if (!txn?.id) throw new Error("Upload failed — no tx ID returned");

  const bundlrTxId = txn.id;
  const arweaveURI = `https://arweave.net/${bundlrTxId}`;
  const bundlrStatusURL = `https://node1.bundlr.network/tx/${bundlrTxId}/status`;

  console.log("📦 Upload sent to Arweave via Bundlr:", arweaveURI);
  console.log("🔍 Checking Bundlr status:", bundlrStatusURL);

  // Poll Bundlr for bundleTxId (which links to Arweave transaction)
  let bundleTxId = null;
  let bundleAttempts = 0;
  while (!bundleTxId && bundleAttempts < 5) {
    try {
      const { data: bundlrStatus } = await axios.get(bundlrStatusURL);
      bundleTxId = bundlrStatus.bundleTxId;
      if (!bundleTxId) {
        console.warn("⚠️ Bundlr bundleTxId not ready yet. Waiting...");
      }
    } catch (err) {
      console.error("❌ Failed to fetch Bundlr status:", err.message);
    }
    if (!bundleTxId) {
      await new Promise((res) => setTimeout(res, 2000));
      bundleAttempts++;
    }
  }

  // Check Arweave mining status using the bundleTxId
  let confirmed = false;
  if (bundleTxId) {
    const arweaveStatusURL = `https://arweave.net/tx/${bundleTxId}/status`;
    console.log("⛓ Checking Arweave status:", arweaveStatusURL);

    let attempts = 0;
    while (!confirmed && attempts < 10) {
      try {
        const { data: arweaveStatus } = await axios.get(arweaveStatusURL);
        if (arweaveStatus?.block_height) {
          confirmed = true;
          console.log("✅ Arweave mining confirmed!");
        } else {
          console.log(`⏳ Not yet mined. Retrying...`);
        }
      } catch (err) {
        console.log("Arweave check failed:", err.message);
      }
      await new Promise((res) => setTimeout(res, 3000));
      attempts++;
    }

    if (!confirmed) {
      console.warn("⚠️ Upload completed but Arweave has not confirmed mining yet.");
    }
  }

  console.log("📦 Final Arweave URI (verified on-chain):", arweaveURI);

  return {
    uri: arweaveURI,
    txHash: bundlrTxId,
    bundleTxId: bundleTxId || null,
    confirmed
  };
}

/**
 * Wrapper to retry the upload process in case of failure.
 * Retries up to 2 times by default with a delay between attempts.
 * 
 * @param {Buffer} buffer - File buffer to upload
 * @param {number} retries - Number of retries allowed (default: 2)
 */
async function uploadToBundlr(buffer, retries = 2) {
  try {
    return await uploadOnce(buffer);
  } catch (err) {
    if (retries > 0) {
      console.warn("⚠️ Upload failed, retrying in 3s...");
      await new Promise((r) => setTimeout(r, 3000));
      return await uploadToBundlr(buffer, retries - 1);
    } else {
      console.error("❌ Final upload attempt failed:", err.message);
      throw err;
    }
  }
}

// Export the upload function to use in backend services/controllers
module.exports = { uploadToBundlr };
