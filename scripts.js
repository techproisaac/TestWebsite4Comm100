// Shared client-side scripts for the site

// simulate a logged-in user with a fixed name
(function() {
    function init() {
        // on every load we ensure the user is "logged in" for demo
        if (!sessionStorage.getItem('userName')) {
            sessionStorage.setItem('userName', 'testName');
        }

        // set a default balance if none exists
        if (!sessionStorage.getItem('balance')) {
            sessionStorage.setItem('balance', '1000.00');
        }

        // render common header into placeholder div
        renderHeader();

        // wire up mobile menu toggle once header is in DOM
        const toggleMenu = () => {
            const toggle = document.querySelector('.menu-toggle');
            const links = document.querySelector('.nav-links');
            if (toggle && links) {
                toggle.addEventListener('click', () => {
                    links.classList.toggle('active');
                });
                // close menu when a link is tapped (helps mobile UX)
                links.querySelectorAll('a').forEach(a => {
                    a.addEventListener('click', () => {
                        links.classList.remove('active');
                    });
                });
            }
        };
        toggleMenu();

        // then update it according to login state
        updateHeader();

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // utility for formatting numbers as money
    function formatMoney(value) {
        if (value == null) return '0.00';
        const num = parseFloat(value);
        return num.toFixed(2);
    }

    // inserts a shared header HTML template into each page
    function renderHeader() {
        const placeholder = document.getElementById('site-header');
        if (!placeholder) return;
        placeholder.innerHTML = `
<header class="header">
    <div class="container">
        <button class="menu-toggle" aria-label="Toggle menu">☰</button>
        <a href="index.html" class="logo"><svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff0000"/>
      <stop offset="100%" stop-color="#ff3333"/>
    </linearGradient>
  </defs>
  <path d="M13 2L3 14h7v8l10-12h-7z" fill="url(#logo-grad)"/>
</svg><span class="logo-text">Lighting Bets</span></a>
        <nav class="nav">
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="index.html#sports">Sports</a>
                <a href="index.html#odds">Lines</a>
                <a href="index.html#promotions">Promotions</a>
                <a href="deposit.html">Deposit</a>
                <a href="#" class="btn-login">Login</a>
                <span class="user-greeting"></span>
                <span class="user-balance"></span>
            </div>
        </nav>
        <span class="notif-icon" title="Notifications">🔔</span>
    </div>
</header>
        `;
    }

    function updateHeader() {
        const userName = sessionStorage.getItem('userName');
        const nav = document.querySelector('nav.nav');
        if (!nav) return;

        let loginEl = nav.querySelector('.btn-login');
        let greetingEl = nav.querySelector('.user-greeting');
        let accountEl = nav.querySelector('.account-link');
        let balanceEl = nav.querySelector('.user-balance');

        if (userName) {
            // ensure login state persists
            sessionStorage.setItem('userName', userName);

            // display greeting
            if (!greetingEl) {
                greetingEl = document.createElement('span');
                greetingEl.className = 'user-greeting';
                nav.appendChild(greetingEl);
            }
            greetingEl.textContent = 'Hello, ' + userName;

            // display balance element
            if (!balanceEl) {
                balanceEl = document.createElement('span');
                balanceEl.className = 'user-balance';
                nav.appendChild(balanceEl);
            }
            balanceEl.textContent = 'Balance: $' + formatMoney(sessionStorage.getItem('balance'));

            // add an "Account" link if it doesn't exist
            if (!accountEl && loginEl) {
                accountEl = document.createElement('a');
                accountEl.href = '#';
                accountEl.className = 'account-link';
                accountEl.textContent = 'Account';
                nav.insertBefore(accountEl, loginEl);
            }

            // hide login/logout link when logged in
            if (loginEl) {
                loginEl.style.display = 'none';
            }
        } else {
            // always set a default user for demo
            sessionStorage.setItem('userName', 'testName');
        }
    }

    // expose updateHeader for external callers
    window.updateHeader = updateHeader;
})();
