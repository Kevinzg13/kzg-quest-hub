// WalletConnect Configuration
const PROJECT_ID = '14cffe4876b0bbc69c19cbe770af1888';
const CHAIN_ID = 10000;
const RPC_URL = 'https://smartbch.fountainhead.cash/mainnet';

let provider = null;
let userWallet = null;
let connectionURI = null;
let currentLang = 'en';

function setLang(lang) {
    currentLang = lang;
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

async function initWalletConnect() {
    try {
        provider = await window.EthereumProvider.init({
            projectId: PROJECT_ID,
            chains: [CHAIN_ID],
            methods: ['eth_sendTransaction', 'eth_sign', 'personal_sign'],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: { [CHAIN_ID]: RPC_URL },
            showQrModal: false
        });

        provider.on('connect', (data) => {
            if (data.accounts && data.accounts.length > 0) {
                handleConnect(data.accounts[0]);
            }
        });

        provider.on('disconnect', () => {
            disconnectWallet();
        });

        return true;
    } catch (error) {
        console.error('WalletConnect init error:', error);
        return false;
    }
}

async function openWalletModal() {
    const btn = document.getElementById('connect-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    if (!provider) {
        const initialized = await initWalletConnect();
        if (!initialized) {
            alert(currentLang === 'es' ? 'Error al iniciar WalletConnect' : 'Error starting WalletConnect');
            btn.classList.remove('loading');
            btn.disabled = false;
            return;
        }
    }

    try {
        await provider.enable();
        const wcUri = provider.uri;
        if (wcUri) {
            connectionURI = wcUri;
            showQRModal(wcUri);
        }
    } catch (error) {
        console.error('Connection error:', error);
        alert(currentLang === 'es' ? 'Error al generar conexión' : 'Error generating connection');
    }

    btn.classList.remove('loading');
    btn.disabled = false;
}

function showQRModal(uri) {
    const modal = document.getElementById('qr-modal');
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = '';

    new QRCode(qrContainer, {
        text: uri,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });

    updateWalletLinks(uri);
    modal.classList.remove('hidden');
    pollForConnection();
}

function updateWalletLinks(uri) {
    const encodedUri = encodeURIComponent(uri);
    document.getElementById('paytaca-link').href = `paytaca://wc?uri=${encodedUri}`;
    document.getElementById('zapit-link').href = `zapit://wc?uri=${encodedUri}`;
    document.getElementById('cashonize-link').href = `wc://${encodedUri}`;
}

function pollForConnection() {
    const checkInterval = setInterval(() => {
        if (provider && provider.accounts && provider.accounts.length > 0) {
            clearInterval(checkInterval);
            handleConnect(provider.accounts[0]);
        }
    }, 1000);
    setTimeout(() => clearInterval(checkInterval), 300000);
}

function handleConnect(address) {
    userWallet = address;
    closeModal();
    document.getElementById('step1-connect').classList.add('hidden');
    document.getElementById('step3-connected').classList.remove('hidden');
    const shortAddress = address.substring(0, 8) + '...' + address.substring(address.length - 4);
    document.getElementById('connected-address').textContent = shortAddress;
    document.getElementById('connected-address').title = address;
    localStorage.setItem('kzg_wallet_connected', 'true');
    localStorage.setItem('kzg_wallet_address', address);
}

function closeModal() {
    document.getElementById('qr-modal').classList.add('hidden');
}

function copyConnectionURI() {
    if (!connectionURI) return;
    navigator.clipboard.writeText(connectionURI).then(() => {
        const btn = document.getElementById('copy-uri-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => btn.innerHTML = originalText, 2000);
    });
}

function disconnectWallet() {
    userWallet = null;
    connectionURI = null;
    if (provider) {
        provider.disconnect();
        provider = null;
    }
    localStorage.removeItem('kzg_wallet_connected');
    localStorage.removeItem('kzg_wallet_address');
    localStorage.removeItem('kzg_waitlist_joined');
    document.getElementById('step3-connected').classList.add('hidden');
    document.getElementById('step1-connect').classList.remove('hidden');
}

async function joinWaitlist() {
    if (!userWallet) return;
    const btn = document.getElementById('join-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.getElementById('step3-connected').style.display = 'none';
        document.getElementById('success-message').classList.remove('hidden');
        const shortAddress = userWallet.substring(0, 10) + '...' + userWallet.substring(userWallet.length - 4);
        document.getElementById('success-wallet').textContent = shortAddress;
        localStorage.setItem('kzg_waitlist_joined', 'true');
    } catch (error) {
        alert(currentLang === 'es' ? 'Error al unirse' : 'Error joining');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedWallet = localStorage.getItem('kzg_wallet_address');
    const savedJoined = localStorage.getItem('kzg_waitlist_joined');

    if (savedJoined && savedWallet) {
        document.getElementById('step1-connect').classList.add('hidden');
        document.getElementById('success-message').classList.remove('hidden');
        document.getElementById('success-wallet').textContent = savedWallet.substring(0, 10) + '...' + savedWallet.substring(savedWallet.length - 4);
    } else if (savedWallet) {
        userWallet = savedWallet;
        document.getElementById('step1-connect').classList.add('hidden');
        document.getElementById('step3-connected').classList.remove('hidden');
        document.getElementById('connected-address').textContent = savedWallet.substring(0, 8) + '...' + savedWallet.substring(savedWallet.length - 4);
    }

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('es')) setLang('es');

    document.getElementById('qr-modal').addEventListener('click', (e) => {
        if (e.target.id === 'qr-modal') closeModal();
    });
});