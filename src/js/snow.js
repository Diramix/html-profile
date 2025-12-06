document.addEventListener("DOMContentLoaded", () => {

    function isDesktop() {
        const ua = navigator.userAgent.toLowerCase();
        const isMobileUA = /android|iphone|ipad|ipod|mobile|opera mini|iemobile/.test(ua);
        return !isMobileUA && window.innerWidth >= 900;
    }

    function createSnow() {
        const snow = document.getElementById('snow');
        if (!snow) return;

        const flake = document.createElement('div');
        flake.className = 'snowflake';

        const size = Math.random() * 6 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const drift = (Math.random() - 0.5) * 200;

        flake.style.left = left + '%';
        flake.style.width = size + 'px';
        flake.style.height = size + 'px';
        flake.style.animationDuration = duration + 's';
        flake.style.setProperty('--drift', drift + 'px');

        snow.appendChild(flake);

        setTimeout(() => flake.remove(), duration * 1000);
    }

    let snowInterval = null;

    function startSnow() {
        if (!snowInterval && isDesktop()) {
            snowInterval = setInterval(createSnow, 120);
        }
    }

    function stopSnow() {
        clearInterval(snowInterval);
        snowInterval = null;
    }

    // Запускаем снег только на ПК
    if (isDesktop()) {
        startSnow();
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopSnow();
        else startSnow();
    });
});
