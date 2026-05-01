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