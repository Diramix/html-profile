function updateIndev() {
    const el = document.querySelector('.indev');
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const scrollWidth = document.documentElement.scrollWidth;
    const scrollHeight = document.documentElement.scrollHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    let device = 'Other';

    if (/windows/.test(userAgent)) device = 'Windows';
    else if (/android/.test(userAgent)) device = 'Android';
    else if (/iphone|ipad|ipod/.test(userAgent)) device = 'iOS';

    const theme = document.body.classList.contains('dark-theme') ? 'Dark' : 'Light';

    let domain = location.hostname;
    if (!domain || domain === "") {
        const pathParts = location.pathname.split("/");
        domain = pathParts[pathParts.length - 1] || 'localfile.html';
    }

    el.innerText =
        `domain: ${domain}
  ` +
        `date: ${dateStr}
  ` +
        `OS: ${device}
  ` +
        `theme: ${theme}
  ` +
        `screen: ${screenWidth}x${screenHeight}
  ` +
        `page (viewport): ${pageWidth}x${pageHeight}
  ` +
        `page (scroll): ${scrollWidth}x${scrollHeight}`;
}

const devModeObserver = new MutationObserver(updateIndev);

document.addEventListener('DOMContentLoaded', () => {
    updateIndev();

    devModeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    window.addEventListener('resize', updateIndev);
    window.addEventListener('scroll', updateIndev);
});