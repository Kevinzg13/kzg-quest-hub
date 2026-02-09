// Language handling
let currentLang = 'en';
let userWallet = null;
let web3Provider = null;

function setLang(lang) {
    currentLang = lang;
    
    // Update buttons
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

// Wallet Connection
async function connectWallet() {
    const btn = document.getElementById('connect-wallet-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        // Check if mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile && window.PayTaca) {
            // PayTaca mobile
            await connectPayTaca();
        } else {
            // Try WalletConnect for other wallets
            await connectWalletConnect();
        }
    } catch (error) {
        console.error('Connection error:', error);
        alert(currentLang === 'es' 
            ? 'Error al conectar billetera. Intenta de nuevo.' 
            : 'Error connecting wallet. Please try again.');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

async function connectWalletConnect() {
    // Initialize WalletConnect
    const provider = new WalletConnectProvider.default({
        rpc: {
            10000: "https://smartbch.fountainhead.cash/mainnet"
        },
        chainId: 10000,
        qrcode: true
    });

    try {
        await provider.enable();
        web3Provider = new Web3(provider);
        
        const accounts = await web3Provider.eth.getAccounts();
        if (accounts.length > 0) {
            userWallet = accounts[0];
            showWalletInfo(userWallet);
        }

        // Listen for disconnect
        provider.on("disconnect", () => {
            disconnectWallet();
        });

    } catch (error) {
        throw error;
    }
}

async function connectPayTaca() {
    if (window.PayTaca) {
        try {
            const result = await window.PayTaca.requestAccount();
            if (result && result.address) {
                userWallet = result.address;
                showWalletInfo(userWallet);
            }
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('PayTaca not found');
    }
}

function showWalletInfo(address) {
    // Hide connect button, show wallet info
    document.getElementById('connect-wallet-btn').classList.add('hidden');
    document.getElementById('wallet-info').classList.remove('hidden');
    
    // Show shortened address
    const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
    document.getElementById('wallet-address').textContent = shortAddress;
    document.getElementById('wallet-address').title = address; // Full address on hover
    
    // Save to localStorage
    localStorage.setItem('kzg_wallet_connected', 'true');
    localStorage.setItem('kzg_wallet_address', address);
}

function disconnectWallet() {
    userWallet = null;
    web3Provider = null;
    
    document.getElementById('connect-wallet-btn').classList.remove('hidden');
    document.getElementById('wallet-info').classList.add('hidden');
    document.getElementById('connect-wallet-btn').classList.remove('loading');
    document.getElementById('connect-wallet-btn').disabled = false;
    
    localStorage.removeItem('kzg_wallet_connected');
    localStorage.removeItem('kzg_wallet_address');
}

async function joinWaitlist() {
    if (!userWallet) {
        alert(currentLang === 'es' ? 'Conecta tu billetera primero' : 'Connect your wallet first');
        return;
    }

    const btn = document.getElementById('join-waitlist-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        // IMPORTANT: Replace with your Google Apps Script URL after setup
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
        
        // For now, simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // When ready, uncomment this:
        /*
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wallet_address: userWallet,
                timestamp: new Date().toISOString(),
                lang: currentLang,
                source: 'landing_page_wallet'
            })
        });
        */

        // Show success
        document.getElementById('wallet-section').style.display = 'none';
        const successMsg = document.getElementById('success-message');
        successMsg.classList.remove('hidden');
        
        const shortAddress = userWallet.substring(0, 10) + '...' + userWallet.substring(userWallet.length - 4);
        document.getElementById('success-wallet').textContent = shortAddress;
        
        // Mark as joined
        localStorage.setItem('kzg_waitlist_joined', 'true');
        localStorage.setItem('kzg_waitlist_wallet', userWallet);
        
    } catch (error) {
        console.error('Error:', error);
        alert(currentLang === 'es' 
            ? 'Error al unirse. Intenta de nuevo.' 
            : 'Error joining. Please try again.');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

// Check if user already connected (on page load)
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved wallet
    const savedWallet = localStorage.getItem('kzg_wallet_address');
    const savedJoined = localStorage.getItem('kzg_waitlist_joined');
    
    if (savedJoined && savedWallet) {
        // Already joined
        document.getElementById('wallet-section').style.display = 'none';
        document.getElementById('success-message').classList.remove('hidden');
        const shortAddress = savedWallet.substring(0, 10) + '...' + savedWallet.substring(savedWallet.length - 4);
        document.getElementById('success-wallet').textContent = shortAddress;
    } else if (savedWallet) {
        // Wallet connected but not joined
        userWallet = savedWallet;
        showWalletInfo(savedWallet);
    }
    
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('es')) {
        setLang('es');
    }
});
