// Developers GitHub info
const developers = [
    { apiUrl: 'https://api.github.com/users/diramix', id: 'Diramix' }
];

const fetchDeveloperData = (dev) => {
    return fetch(dev.apiUrl)
        .then(response => response.ok ? response.json() : null)
        .then(data => {
            const nicknameElement = document.querySelector(`.nickname#${dev.id}`);
            if (!nicknameElement) return;

            const content = data && data.login ? data.login : 'Unknown';
            const linkElement = document.createElement(content === 'Unknown' ? 'span' : 'a');

            if (content !== 'Unknown') {
                linkElement.href = `https://github.com/${data.login}`;
                linkElement.target = '_blank';
            }

            linkElement.textContent = content;
            nicknameElement.appendChild(linkElement);
        })
        .catch(() => handleError(dev.id));
};

const handleError = (id) => {
    const nicknameElement = document.querySelector(`.nickname#${id}`);
    if (nicknameElement) {
        const span = document.createElement('span');
        span.textContent = 'Unknown';
        nicknameElement.appendChild(span);
    }
};

const fetchReleaseData = () => {
    return fetch('https://raw.githubusercontent.com/Diramix/Diramix/refs/heads/main/README.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch README.md');
            }
            return response.text();
        })
        .then(data => updateDescription(data))
        .catch(handleReleaseError);
};

const updateDescription = (description) => {
    const converter = new showdown.Converter({ simplifiedAutoLink: true, openLinksInNewWindow: true });
    const htmlDescription = converter.makeHtml(description || '');
    const descriptionElement = document.querySelector('.description');

    if (descriptionElement) {
        descriptionElement.innerHTML = htmlDescription;
    }
};

// Получение README.md
const handleReleaseError = () => {
    console.error('Error fetching release data');

    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        descriptionElement.textContent = 'Unknown';
        descriptionElement.style.color = 'red';
    }

    const body2Element = document.querySelector('.body2');
    if (body2Element) {
        body2Element.style.background = 'linear-gradient(180deg, #F00 0%, #000d1a 100%)';
    }

    const latestElements = document.querySelectorAll('#ab_latest');
    latestElements.forEach(element => element.style.display = 'none');

    const skillIssuesElements = document.querySelectorAll('.skill_issues');
    skillIssuesElements.forEach(element => element.style.display = 'none');
};

developers.forEach(fetchDeveloperData);
fetchReleaseData();

// Ненавижу Mobile
// (function () {
//     const userAgent = navigator.userAgent;
//     const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
//     let platform = 'платформа';

//     if (userAgent.match(/Android/i)) {
//         platform = 'Android';
//     } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
//         platform = 'iOS';
//     } else if (userAgent.match(/Windows Phone/i)) {
//         platform = 'Windows Phone';
//     } else if (userAgent.match(/BlackBerry/i)) {
//         platform = 'BlackBerry';
//     }

//     if (isMobile) {
//         const style = document.createElement('style');
//         style.innerHTML = "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');";
//         document.head.appendChild(style);

//         document.documentElement.innerHTML = '';
//         const block = document.createElement('div');
//         block.style.cssText = `
//       position: fixed;
//       top: 0; left: 0;
//       width: 100%; height: 100%;
//       background: black;
//       color: red;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       font-size: 32px;
//       font-weight: bold;
//       z-index: 99999;
//       font-family: 'Noto Sans', sans-serif;
//     `;
//         block.textContent = `Ненавижу ${platform}`;
//         document.body.appendChild(block);
//     }
// })();

// Fade Volume
let mediaElements = document.querySelectorAll('audio, video');

mediaElements.forEach(media => {
    media.fadeInInterval = null;
    media.fadeOutInterval = null;

    media.addEventListener('play', function () {
        mediaElements.forEach(el => {
            if (el !== media && !el.paused) {
                clearInterval(el.fadeInInterval);
                clearInterval(el.fadeOutInterval);
                el.fadeOutInterval = setInterval(() => {
                    if (el.volume > 0.05) {
                        el.volume -= 0.05;
                    } else {
                        el.volume = 0;
                        clearInterval(el.fadeOutInterval);
                    }
                }, 50);
            }
        });
    });

    media.addEventListener('pause', function () {
        mediaElements.forEach(el => {
            if (el !== media && el.volume < 1) {
                clearInterval(el.fadeOutInterval);
                clearInterval(el.fadeInInterval);
                el.fadeInInterval = setInterval(() => {
                    if (el.volume < 1) {
                        el.volume += 0.05;
                    } else {
                        el.volume = 1;
                        clearInterval(el.fadeInInterval);
                    }
                }, 50);
            }
        });
    });

    media.addEventListener('ended', function () {
        mediaElements.forEach(el => {
            if (el !== media && el.volume < 1) {
                clearInterval(el.fadeOutInterval);
                clearInterval(el.fadeInInterval);
                el.fadeInInterval = setInterval(() => {
                    if (el.volume < 1) {
                        el.volume += 0.05;
                    } else {
                        el.volume = 1;
                        clearInterval(el.fadeInInterval);
                    }
                }, 50);
            }
        });
    });
});
