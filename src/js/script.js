// Waiting for loading
const loader = document.getElementById("loader");
const loadingWrapper = document.getElementById("loadingWrapper");
const requiredFiles = [
    "https://www.dropbox.com/scl/fi/k0mzsi9ktq9chj8tcwsl8/bg.mp4?rlkey=u20frt59aale1awxy75vs33no&st=9d83h0bc&dl=1",
    "https://www.dropbox.com/scl/fi/j80sm4j8cqn9ucqska58e/fav.mp3?rlkey=tonl7mes0rfgvaghmj16wnhtc&st=7f7dux1b&dl=1"
];

let loaded = 0;

function updateLoader() {
    loaded++;
    const percent = Math.round((loaded / requiredFiles.length) * 100);
    loader.textContent = `Loading: ${percent}%`;
    if (loaded === requiredFiles.length) {
        loadingWrapper.style.display = "none";
    }
}

requiredFiles.forEach(src => {
    const isMedia = /\.(mp4|mp3|ogg|wav|webm)$/i.test(src);
    const element = document.createElement(isMedia ? "video" : "img");
    element.onloadeddata = updateLoader;
    element.onerror = updateLoader;
    element.src = src;
    if (isMedia) element.preload = "auto";
});

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

// Title Animation
let splashes = [];
let currentText = "";
let displayText = "";
let textIndex = 0;
let charIndex = 0;
let typing = true;
let cursorVisible = true;
let pause = false;

fetch("src/splashes.txt")
    .then(response => response.text())
    .then(text => {
        splashes = text.split("\n").filter(line => line.trim() !== "");
        if (splashes.length === 0) return;
        currentText = splashes[0];
        setInterval(() => {
            cursorVisible = !cursorVisible;
        }, 500);
        updateTitle();
    });

function updateTitle() {
    if (!pause) {
        if (typing) {
            if (charIndex < currentText.length) {
                displayText += currentText[charIndex];
                charIndex++;
            } else {
                pause = true;
                setTimeout(() => {
                    typing = false;
                    pause = false;
                }, 2000);
            }
        } else {
            if (charIndex > 0) {
                displayText = displayText.slice(0, -1);
                charIndex--;
            } else {
                pause = true;
                textIndex = (textIndex + 1) % splashes.length;
                currentText = splashes[textIndex];
                setTimeout(() => {
                    typing = true;
                    pause = false;
                }, 500);
            }
        }
    }

    document.title = displayText + (cursorVisible ? "_" : " ");
    setTimeout(updateTitle, 300);
}

// Fading main_container
let mainContainer = document.querySelector('.main_container');
let timeoutId;
let isHidden = false;
let players = new Map();

function hideContainer() {
    if (isAnyVideoPlaying()) return;
    mainContainer.style.transition = 'opacity 5s';
    mainContainer.style.opacity = '0';
    isHidden = true;
}

function showContainer() {
    if (isHidden) {
        mainContainer.style.transition = 'opacity 0.3s';
        mainContainer.style.opacity = '1';
        isHidden = false;
    }
}

function resetTimer() {
    if (isAnyVideoPlaying()) {
        showContainer();
        clearTimeout(timeoutId);
        return;
    }

    showContainer();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        if (!isAnyVideoPlaying()) {
            hideContainer();
        }
    }, 10000);
}

document.addEventListener('mousemove', resetTimer);
document.addEventListener('touchstart', resetTimer);
document.addEventListener('touchmove', resetTimer);
document.addEventListener('click', resetTimer);
document.addEventListener('scroll', resetTimer, { passive: true });

document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget || e.relatedTarget.nodeName === "HTML") {
        timeoutId = setTimeout(() => {
            if (!isAnyVideoPlaying()) {
                hideContainer();
            }
        }, 10000);
    }
});

resetTimer();

function isAnyVideoPlaying() {
    for (const player of players.values()) {
        const state = player.getPlayerState();
        // Состояния: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
        if (state === 1) return true; // playing
    }
    return false;
}

function loadYouTubeAPI(callback) {
    if (window.YT && window.YT.Player) {
        callback();
    } else {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => callback();
    }
}

function setupPlayers() {
    document.querySelectorAll('iframe.youtube-embed').forEach((iframe) => {
        if (!players.has(iframe)) {
            const player = new YT.Player(iframe, {
                events: {
                    'onStateChange': resetTimer
                }
            });
            players.set(iframe, player);
        }
    });
}

loadYouTubeAPI(setupPlayers);

// Mute Button
const video = document.getElementById('background-video');
const btn = document.getElementById('mute-btn');

btn.addEventListener('click', () => {
    video.muted = !video.muted;
    btn.classList.toggle('active', video.muted);
    btn.textContent = video.muted ? '🔇' : '🔊';
    btn.setAttribute('aria-pressed', video.muted);
});