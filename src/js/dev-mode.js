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

      const infoText =
            `Domain: ${domain}\n` +
            `Date: ${dateStr}\n` +
            `OS: ${device}\n` +
            `Theme: ${theme}\n` +
            `Screen: ${screenWidth}x${screenHeight}\n` +
            `Page (viewport): ${pageWidth}x${pageHeight}\n` +
            `Page (scroll): ${scrollWidth}x${scrollHeight}`;

      el.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE || child.className !== 'dev-menu') child.remove();
      });
      el.insertBefore(document.createTextNode(infoText), el.firstChild);
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

      document.getElementById('themeToggleBtn').addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                  document.body.classList.remove('dark-theme');
                  document.body.classList.add('light-theme');
            } else {
                  document.body.classList.remove('light-theme');
                  document.body.classList.add('dark-theme');
            }
      });

      document.getElementById('toggleBgImg').addEventListener('click', () => {
            const video = document.getElementById('background-video');
            const devMode = document.querySelector('.dev-mode');

            if (video.style.display === 'none') {
                  video.pause();
                  video.currentTime = 0;
                  video.style.display = '';
                  devMode.style.backgroundImage = '';
                  devMode.style.backgroundSize = '';
                  devMode.style.backgroundPosition = '';
                  video.play();
            } else {
                  video.pause();
                  video.style.display = 'none';
                  devMode.style.backgroundImage = 'url("https://github.com/Diramix/html-profile/raw/main/src/assets/dev-mode-bg.jpg")';
                  devMode.style.backgroundSize = 'cover';
                  devMode.style.backgroundPosition = 'center';
            }
      });
});