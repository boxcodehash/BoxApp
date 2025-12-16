const MUZZLE_CONTRACT = "0xef3dAa5fDa8Ad7aabFF4658f1F78061fd626B8f0";
const REQUIRED = "20000000";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

document.getElementById("connect").onclick = async () => {
  const error = document.getElementById("error");

  if (!window.ethereum) {
    error.textContent = "Wallet not detected";
    error.classList.remove("hidden");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);

    const network = await provider.getNetwork();
    if (network.chainId !== 1) {
      error.textContent = "Switch to Ethereum Mainnet";
      error.classList.remove("hidden");
      return;
    }

    const signer = provider.getSigner();
    const user = await signer.getAddress();

    const token = new ethers.Contract(MUZZLE_CONTRACT, ABI, provider);
    const decimals = await token.decimals();
    const balance = await token.balanceOf(user);

    const min = ethers.utils.parseUnits(REQUIRED, decimals);

    if (balance.lt(min)) {
      error.textContent = "Insufficient MUZZLE balance";
      error.classList.remove("hidden");
      return;
    }

    // ✅ acceso concedido
    window.location.href = "pagina_segura.html";

  } catch (e) {
    console.error(e);
    error.textContent = "Verification failed";
    error.classList.remove("hidden");
  }
};
