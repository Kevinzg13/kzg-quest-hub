// Language handling
let currentLang = 'en';

function setLang(lang) {
    currentLang = lang;

    // Update buttons
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');

    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.tagName === 'INPUT') {
            el.placeholder = el.getAttribute(`data-placeholder-${lang}`) || el.getAttribute(`data-${lang}`);
        } else {
            el.textContent = el.getAttribute(`data-${lang}`);
        }
    });

    // Update input placeholder specifically
    const emailInput = document.getElementById('email');
    if (lang === 'es') {
        emailInput.placeholder = 'Ingresa tu email';
    } else {
        emailInput.placeholder = 'Enter your email';
    }
}

// Form submission
async function handleSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('success-message');

    // Validate email
    if (!email || !email.includes('@')) {
        alert(currentLang === 'es' ? 'Por favor ingresa un email válido' : 'Please enter a valid email');
        return;
    }

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // IMPORTANT: Replace with your Google Apps Script URL after setup
        // See README.md for instructions
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

        // For now, simulate submission (remove this when connecting to Google Sheets)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // When ready, uncomment this:
        /*
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                timestamp: new Date().toISOString(),
                lang: currentLang,
                source: 'landing_page'
            })
        });
        */

        // Show success
        document.getElementById('waitlist-form').style.display = 'none';
        successMsg.classList.remove('hidden');

        // Optional: Store in localStorage to remember user
        localStorage.setItem('kzg_waitlist_joined', 'true');
        localStorage.setItem('kzg_waitlist_email', email);

    } catch (error) {
        console.error('Error:', error);
        alert(currentLang === 'es' 
            ? 'Error al registrar. Intenta de nuevo.' 
            : 'Error registering. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Check if user already joined (on page load)
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('kzg_waitlist_joined')) {
        document.getElementById('waitlist-form').style.display = 'none';
        document.getElementById('success-message').classList.remove('hidden');
    }

    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('es')) {
        setLang('es');
    }
});