if (location.protocol === 'file:' && !document.body.classList.contains('dev-mode')) {
      document.body.classList.add('dev-mode');
}

const buttons = [
      {
            id: 'themeToggleBtn',
            onClick: () => {
                  const body = document.body;
                  body.classList.toggle('dark-theme');
                  body.classList.toggle('light-theme');
            }
      },
      {
            id: 'toggleBgImg',
            onClick: () => {
                  const video = document.getElementById('background-video');
                  const bgCover = document.getElementById('dev-bg-cover');

                  if (video.style.display === 'none') {
                        video.pause();
                        video.currentTime = 0;
                        video.style.display = '';
                        bgCover.style.display = 'none';
                        bgCover.style.backgroundImage = '';
                        video.play();
                  } else {
                        video.pause();
                        video.style.display = 'none';
                        bgCover.style.backgroundImage = 'url("https://github.com/Diramix/html-profile/raw/main/src/assets/dev-mode-bg.jpg")';
                        bgCover.style.display = 'block';
                  }
            }
      },
      {
            id: 'toggleMainContainerVisible',
            onClick: () => {
                  const mainContainer = document.querySelector('.profile_container');
                  mainContainer.classList.toggle('dev_visible');
                  mainContainer.classList.toggle('dev_hidden');
            }
      }
];

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
      let engine = 'Unknown';

      if (/windows/.test(userAgent)) device = 'Windows';
      else if (/android/.test(userAgent)) device = 'Android';
      else if (/iphone|ipad|ipod/.test(userAgent)) device = 'iOS';

      if (userAgent.includes('edg/')) engine = 'Chromium (Edge)';
      else if (userAgent.includes('chrome') && !userAgent.includes('edg/')) engine = 'Chromium';
      else if (userAgent.includes('firefox')) engine = 'Gecko';
      else if (userAgent.includes('safari') && !userAgent.includes('chrome')) engine = 'WebKit';

      const theme = document.body.classList.contains('dark-theme') ? 'Dark' : 'Light';

      let domain = location.hostname;
      if (!domain) {
            const pathParts = location.pathname.split('/');
            domain = pathParts[pathParts.length - 1] || 'localfile.html';
      }

      const infoText =
            `Domain: ${domain}\n` +
            `Date: ${dateStr}\n` +
            `OS: ${device}\n` +
            `Engine: ${engine}\n` +
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

      buttons.forEach(({ id, onClick }) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', onClick);
      });
});