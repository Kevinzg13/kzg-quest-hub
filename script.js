// Language handling
let currentLang = 'en';
let userWallet = null;

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

// Step 1: Verify Address Format
function verifyAddress() {
    const addressInput = document.getElementById('bch-address');
    const address = addressInput.value.trim();
    const btn = document.getElementById('verify-btn');
    
    // Basic BCH address validation
    const bchRegex = /^(bitcoincash:)?[qQpP][a-zA-Z0-9]{41}$/;
    
    if (!bchRegex.test(address)) {
        alert(currentLang === 'es' 
            ? 'Dirección BCH inválida. Debe empezar con bitcoincash:qq...' 
            : 'Invalid BCH address. Must start with bitcoincash:qq...');
        return;
    }
    
    // Normalize address (add prefix if missing)
    userWallet = address.startsWith('bitcoincash:') ? address : 'bitcoincash:' + address;
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    setTimeout(() => {
        document.getElementById('step1-address').classList.add('hidden');
        document.getElementById('step2-sign').classList.remove('hidden');
        btn.classList.remove('loading');
        btn.disabled = false;
    }, 500);
}

// Copy message to clipboard
function copyMessage() {
    const message = document.getElementById('sign-message').textContent;
    navigator.clipboard.writeText(message).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✓';
        setTimeout(() => btn.textContent = '📋', 2000);
    });
}

// Step 2: Connect with Signature
function connectWallet() {
    const sigInput = document.getElementById('signature');
    const signature = sigInput.value.trim();
    const btn = document.getElementById('connect-btn');
    
    if (!signature || signature.length < 10) {
        alert(currentLang === 'es' 
            ? 'Por favor pega una firma válida' 
            : 'Please paste a valid signature');
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Simulate verification (in production, verify cryptographically)
    setTimeout(() => {
        // In real implementation, you would verify:
        // bitcoinjs.message.verify(userWallet, 'KZG Quest Hub 2025', signature)
        
        document.getElementById('step2-sign').classList.add('hidden');
        document.getElementById('step3-connected').classList.remove('hidden');
        
        const shortAddress = userWallet.substring(0, 12) + '...' + userWallet.substring(userWallet.length - 4);
        document.getElementById('connected-address').textContent = shortAddress;
        document.getElementById('connected-address').title = userWallet;
        
        // Save to localStorage
        localStorage.setItem('kzg_wallet_connected', 'true');
        localStorage.setItem('kzg_wallet_address', userWallet);
        localStorage.setItem('kzg_signature', signature);
        
        btn.classList.remove('loading');
        btn.disabled = false;
    }, 1500);
}

function goBack() {
    document.getElementById('step2-sign').classList.add('hidden');
    document.getElementById('step1-address').classList.remove('hidden');
    userWallet = null;
}

function disconnectWallet() {
    userWallet = null;
    localStorage.removeItem('kzg_wallet_connected');
    localStorage.removeItem('kzg_wallet_address');
    localStorage.removeItem('kzg_signature');
    localStorage.removeItem('kzg_waitlist_joined');
    
    document.getElementById('step3-connected').classList.add('hidden');
    document.getElementById('step1-address').classList.remove('hidden');
    document.getElementById('bch-address').value = '';
    document.getElementById('signature').value = '';
}

async function joinWaitlist() {
    if (!userWallet) return;
    
    const btn = document.getElementById('join-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
        
        // Simulate submission for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        /* When ready, use this:
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wallet_address: userWallet,
                signature: localStorage.getItem('kzg_signature'),
                timestamp: new Date().toISOString(),
                lang: currentLang,
                source: 'landing_page_wallet'
            })
        });
        */
        
        document.getElementById('step3-connected').style.display = 'none';
        document.getElementById('success-message').classList.remove('hidden');
        
        const shortAddress = userWallet.substring(0, 12) + '...' + userWallet.substring(userWallet.length - 4);
        document.getElementById('success-wallet').textContent = shortAddress;
        
        localStorage.setItem('kzg_waitlist_joined', 'true');
        
    } catch (error) {
        console.error('Error:', error);
        alert(currentLang === 'es' 
            ? 'Error al unirse. Intenta de nuevo.' 
            : 'Error joining. Please try again.');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const savedWallet = localStorage.getItem('kzg_wallet_address');
    const savedJoined = localStorage.getItem('kzg_waitlist_joined');
    
    if (savedJoined && savedWallet) {
        document.getElementById('step1-address').classList.add('hidden');
        document.getElementById('success-message').classList.remove('hidden');
        const shortAddress = savedWallet.substring(0, 12) + '...' + savedWallet.substring(savedWallet.length - 4);
        document.getElementById('success-wallet').textContent = shortAddress;
    } else if (savedWallet) {
        userWallet = savedWallet;
        document.getElementById('step1-address').classList.add('hidden');
        document.getElementById('step3-connected').classList.remove('hidden');
        const shortAddress = savedWallet.substring(0, 12) + '...' + savedWallet.substring(savedWallet.length - 4);
        document.getElementById('connected-address').textContent = shortAddress;
    }
    
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('es')) {
        setLang('es');
    }
});
