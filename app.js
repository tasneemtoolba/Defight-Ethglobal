async function connect() {
if (!window.ethereum) {
    alert("Install MetaMask");
    return;
}

const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);

const signer = await provider.getSigner();
const address = await signer.getAddress();

document.getElementById("address").innerText = address;
}

async function getChainId() {
if (!window.ethereum) {
    alert("Install MetaMask");
    return;
}

const provider = new ethers.BrowserProvider(window.ethereum);
const network = await provider.getNetwork();

document.getElementById("chain").innerText = network.chainId.toString();
}

async function switchChain() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
  
    const chainId = "0x4115";
  
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }]
      });
    } catch (err) {
      // If chain not added yet
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId,
            chainName: "Ethereum Mainnet",
            rpcUrls: ["https://evmrpc.0g.ai"],
            nativeCurrency: {
              name: "0g",
              symbol: "0G",
              decimals: 18
            },
            blockExplorerUrls: ["explorer.0g.ai/mainnet"]
          }]
        });
      } else {
        console.error(err);
      }
    }
}