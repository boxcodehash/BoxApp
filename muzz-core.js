// muzz-core.js - El motor privado de MuzzSnap
const VAULT_KEY = "muzz_p2p_secure_key_x99"; 
const firebaseConfig = {
    apiKey: "AIzaSyAe1-JfNde0NKIMdE7phfEXlm9JaqUH0jY",
    authDomain: "pulsari.firebaseapp.com",
    databaseURL: "https://pulsari-default-rtdb.firebaseio.com",
    projectId: "pulsari"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Función para encriptar y guardar localmente
const saveToVault = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), VAULT_KEY).toString();
    localStorage.setItem('muzz_vault', ciphertext);
};

// Función para desencriptar el nodo
const loadFromVault = () => {
    const saved = localStorage.getItem('muzz_vault');
    if (!saved) return [];
    try {
        const bytes = CryptoJS.AES.decrypt(saved, VAULT_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) { return []; }
};

// Lógica de limpieza y sincronización
const syncBridge = (callback) => {
    const bridgeRef = database.ref('p2p_relay');
    bridgeRef.on('child_added', snap => {
        const incoming = snap.val();
        if (Date.now() - incoming.timestamp < 86400000) { // 24h
            callback(incoming);
        } else {
            database.ref(`p2p_relay/${snap.key}`).remove();
        }
    });
};
