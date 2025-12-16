(async () => {
  const SESSION_KEY = 'muzzsnap_access';
  const MAX_TIME = 60 * 60 * 1000; // 1 hora

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) throw 'NO_SESSION';

    const session = JSON.parse(raw);
    if (!session.address || !session.timestamp) throw 'INVALID_SESSION';

    if (Date.now() - session.timestamp > MAX_TIME) {
      sessionStorage.removeItem(SESSION_KEY);
      throw 'SESSION_EXPIRED';
    }

    if (!window.ethereum) throw 'NO_WALLET';

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (!accounts.length) throw 'NO_ACCOUNT';

    if (accounts[0].toLowerCase() !== session.address.toLowerCase()) {
      sessionStorage.removeItem(SESSION_KEY);
      throw 'ACCOUNT_CHANGED';
    }

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (parseInt(chainId, 16) !== 1) throw 'WRONG_NETWORK';

    // ✅ TODO OK → LA PÁGINA SE VE

  } catch (e) {
    console.warn('Access denied:', e);
    window.location.replace('index.html');
  }
})();
