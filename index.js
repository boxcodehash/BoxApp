// ================= CONFIG =================
const CONFIG = {
  CONTRACT: '0xef3dAa5fDa8Ad7aabFF4658f1F78061fd626B8f0',
  MIN_BALANCE: 20000000,
  NETWORK_ID: 1, // ETH
  REDIRECT: 'pagina_segura.html'
};

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// ================= LOGIN =================
async function loginWithWallet() {
  try {
    if (!window.ethereum) {
      alert('Wallet not detected');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // 🔒 Red correcta
    const network = await provider.getNetwork();
    if (network.chainId !== CONFIG.NETWORK_ID) {
      alert('Please connect to Ethereum Mainnet');
      return;
    }

    // 💰 Balance MUZZLE
    const token = new ethers.Contract(CONFIG.CONTRACT, ERC20_ABI, provider);
    const rawBalance = await token.balanceOf(address);
    const decimals = await token.decimals();
    const balance = Number(ethers.utils.formatUnits(rawBalance, decimals));

    if (balance < CONFIG.MIN_BALANCE) {
      alert(`Access denied. You need at least ${CONFIG.MIN_BALANCE.toLocaleString()} MUZZLE`);
      return;
    }

    // ✍️ Firma (ligera, sin gas)
    await signer.signMessage(`MuzzSnap access\nWallet: ${address}\nTime: ${Date.now()}`);

    // ✅ SESIÓN
    sessionStorage.setItem('muzzsnap_access', JSON.stringify({
      address,
      timestamp: Date.now()
    }));

    // 🚀 REDIRECCIÓN
    window.location.href = CONFIG.REDIRECT;

  } catch (err) {
    console.error(err);
    alert('Login cancelled or failed');
  }
}

// EJEMPLO: botón
document.getElementById('loginButton')?.addEventListener('click', loginWithWallet);
