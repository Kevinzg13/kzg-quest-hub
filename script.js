let currentLang = 'en';
let userWallet = null;
let userBalance = { bch: 0, usd: 0, kzg: 0 };

function toggleLang() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    document.getElementById('lang-toggle').textContent = currentLang === 'en' ? 'EN/ES' : 'ES/EN';

    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
}

function openSidePanel() {
    document.getElementById('side-panel').classList.add('open');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSidePanel() {
    document.getElementById('side-panel').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = '';
}

function connectWallet(walletType) {
    setTimeout(() => {
        const mockAddress = 'bitcoincash:qr' + Math.random().toString(36).substring(2, 15);
        userWallet = {
            address: mockAddress,
            type: walletType,
            shortAddress: mockAddress.substring(0, 8) + '...' + mockAddress.substring(mockAddress.length - 4)
        };

        userBalance = {
            bch: (Math.random() * 5).toFixed(4),
            usd: (Math.random() * 2000).toFixed(2),
            kzg: (Math.random() * 10000).toFixed(2)
        };

        showConnectedState();
        updateNavbar();
    }, 1000);
}

function showConnectedState() {
    document.getElementById('panel-disconnected').classList.add('hidden');
    document.getElementById('panel-connected').classList.remove('hidden');

    const walletNames = {
        'paytaca': 'Paytaca',
        'zapit': 'Zapit',
        'cashonize': 'Cashonize',
        'mainnet': 'Browser Wallet'
    };
    document.getElementById('wallet-name').textContent = walletNames[userWallet.type] || 'Wallet';

    document.getElementById('balance-usd').textContent = '$' + parseFloat(userBalance.usd).toLocaleString();
    document.getElementById('balance-bch').textContent = userBalance.bch + ' BCH';

    document.getElementById('bch-amount').textContent = userBalance.bch;
    document.getElementById('bch-value').textContent = '$' + (userBalance.bch * 400).toFixed(2);

    document.getElementById('kzg-amount').textContent = userBalance.kzg;
    document.getElementById('kzg-value').textContent = '$' + (userBalance.kzg * 0.05).toFixed(2);

    localStorage.setItem('kzg_wallet', JSON.stringify(userWallet));
    localStorage.setItem('kzg_balance', JSON.stringify(userBalance));
}

function disconnectWallet() {
    userWallet = null;
    userBalance = { bch: 0, usd: 0, kzg: 0 };

    document.getElementById('panel-connected').classList.add('hidden');
    document.getElementById('panel-disconnected').classList.remove('hidden');

    localStorage.removeItem('kzg_wallet');
    localStorage.removeItem('kzg_balance');
    localStorage.removeItem('kzg_joined');

    updateNavbar();
}

function updateNavbar() {
    const btn = document.getElementById('connect-btn-nav');
    if (userWallet) {
        btn.textContent = userWallet.shortAddress;
        btn.style.background = 'var(--bg-card)';
        btn.style.border = '1px solid var(--border-color)';
        btn.style.color = 'var(--text-primary)';
    } else {
        btn.textContent = currentLang === 'es' ? 'Conectar' : 'Connect';
        btn.style.background = '';
        btn.style.border = '';
        btn.style.color = '';
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');
}

function joinWaitlist() {
    if (!userWallet) return;

    const btn = document.getElementById('join-waitlist-btn');
    btn.innerHTML = '<span>✓ ' + (currentLang === 'es' ? 'Uniendo...' : 'Joining...') + '</span>';
    btn.disabled = true;

    setTimeout(() => {
        document.getElementById('panel-connected').classList.add('hidden');
        document.getElementById('panel-success').classList.remove('hidden');

        localStorage.setItem('kzg_joined', 'true');

        const mainCta = document.getElementById('main-cta');
        mainCta.innerHTML = '<span>✓ ' + (currentLang === 'es' ? '¡Ya estás en la lista!' : "You're on the list!") + '</span>';
        mainCta.disabled = true;
        mainCta.style.background = 'var(--success)';
    }, 1500);
}

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(139, 92, 246, ${Math.random() * 0.5});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    const savedWallet = localStorage.getItem('kzg_wallet');
    const savedBalance = localStorage.getItem('kzg_balance');
    const savedJoined = localStorage.getItem('kzg_joined');

    if (savedWallet) {
        userWallet = JSON.parse(savedWallet);
        userBalance = JSON.parse(savedBalance);
        updateNavbar();

        if (savedJoined) {
            const mainCta = document.getElementById('main-cta');
            mainCta.innerHTML = '<span>✓ ' + (currentLang === 'es' ? '¡Ya estás en la lista!' : "You're on the list!") + '</span>';
            mainCta.disabled = true;
            mainCta.style.background = 'var(--success)';
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidePanel();
    });
});