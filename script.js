let currentLang = 'en';
let userWallet = null;
let selectedWallet = null;

function setLang(lang) {
    currentLang = lang;
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.hasAttribute('placeholder') && el.getAttribute(`data-placeholder-${lang}`)) {
            el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
        } else {
            el.textContent = el.getAttribute(`data-${lang}`);
        }
    });
}

function openWalletModal() {
    document.getElementById('wallet-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('wallet-modal').classList.add('hidden');
}

function handleWalletOpen(walletName) {
    selectedWallet = walletName;
    // Give time for app to open
    setTimeout(() => {
        closeModal();
        showVerifyStep();
    }, 500);
}

function showVerifyStep() {
    document.getElementById('step1-connect').classList.add('hidden');
    document.getElementById('step2-verify').classList.remove('hidden');
}

function goBackToWallets() {
    document.getElementById('step2-verify').classList.add('hidden');
    document.getElementById('step1-connect').classList.remove('hidden');
    selectedWallet = null;
}

function connectManual() {
    const addressInput = document.getElementById('manual-address');
    const address = addressInput.value.trim();

    // Validate BCH address
    const bchRegex = /^(bitcoincash:)?[qQpP][a-zA-Z0-9]{41}$/;

    if (!bchRegex.test(address)) {
        alert(currentLang === 'es' 
            ? 'Dirección BCH inválida. Debe empezar con bitcoincash:qq...' 
            : 'Invalid BCH address. Must start with bitcoincash:qq...');
        return;
    }

    userWallet = address.startsWith('bitcoincash:') ? address : 'bitcoincash:' + address;
    closeModal();
    showVerifyStep();
}

function copyMessage() {
    const message = document.getElementById('sign-message').textContent;
    navigator.clipboard.writeText(message).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✓';
        setTimeout(() => btn.textContent = '📋', 2000);
    });
}

function verifySignature() {
    const sigInput = document.getElementById('signature');
    const signature = sigInput.value.trim();
    const btn = document.getElementById('verify-btn');

    if (!signature || signature.length < 10) {
        alert(currentLang === 'es' 
            ? 'Por favor pega una firma válida' 
            : 'Please paste a valid signature');
        return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    // Simulate verification
    setTimeout(() => {
        // In production: verify signature cryptographically
        // For now, accept any non-empty signature

        document.getElementById('step2-verify').classList.add('hidden');
        document.getElementById('step3-connected').classList.remove('hidden');

        const shortAddress = userWallet.substring(0, 10) + '...' + userWallet.substring(userWallet.length - 4);
        document.getElementById('connected-address').textContent = shortAddress;
        document.getElementById('connected-address').title = userWallet;

        localStorage.setItem('kzg_wallet_connected', 'true');
        localStorage.setItem('kzg_wallet_address', userWallet);
        localStorage.setItem('kzg_signature', signature);

        btn.classList.remove('loading');
        btn.disabled = false;
    }, 1500);
}

function disconnectWallet() {
    userWallet = null;
    selectedWallet = null;

    localStorage.removeItem('kzg_wallet_connected');
    localStorage.removeItem('kzg_wallet_address');
    localStorage.removeItem('kzg_signature');
    localStorage.removeItem('kzg_waitlist_joined');

    document.getElementById('step3-connected').classList.add('hidden');
    document.getElementById('step1-connect').classList.remove('hidden');
    document.getElementById('manual-address').value = '';
    document.getElementById('signature').value = '';
}

async function joinWaitlist() {
    if (!userWallet) return;

    const btn = document.getElementById('join-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

        // Simulate
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

// On page load
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
        document.getElementById('connected-address').textContent = savedWallet.substring(0, 10) + '...' + savedWallet.substring(savedWallet.length - 4);
    }

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('es')) {
        setLang('es');
    }

    // Close modal on outside click
    document.getElementById('wallet-modal').addEventListener('click', (e) => {
        if (e.target.id === 'wallet-modal') {
            closeModal();
        }
    });
});