// Waiting for loading
const loader = document.getElementById("loader");
const loadingWrapper = document.getElementById("loadingWrapper");
const requiredFiles = [
    "https://www.dropbox.com/scl/fi/k0mzsi9ktq9chj8tcwsl8/bg.mp4?rlkey=u20frt59aale1awxy75vs33no&st=f61owri8&dl=1",
    "https://www.dropbox.com/scl/fi/oqmaneh4kqgcwzfsjh7od/music.mp3?rlkey=0l9o0gv3d8ln9d0yokma6zo3n&st=51ig99p1&dl=1"
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

const fetchReleaseData = () => {
    fetch('https://raw.githubusercontent.com/Diramix/Diramix/refs/heads/main/README.md')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch README.md');
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

fetchReleaseData();

// Fade Volume
let mediaElements = document.querySelectorAll('.track-audio, .body2');

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

// Theme control
const video = document.getElementById('background-video');
const muteBtn = document.getElementById('mute-btn');
const themeBtn = document.getElementById('toggle-theme-btn');
const body = document.body;

// Mute Button
if (/Mobi|Android/i.test(navigator.userAgent)) {
    video.muted = true;
    muteBtn.classList.add('active');
    muteBtn.textContent = '🔇';
    muteBtn.setAttribute('aria-pressed', true);
}

muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.classList.toggle('active', video.muted);
    muteBtn.textContent = video.muted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-pressed', video.muted);
});

// Change the gender!
function applyTheme(theme) {
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(theme);
    themeBtn.textContent = theme === 'dark-theme' ? '🌙' : '☀️';
    themeBtn.setAttribute('aria-pressed', theme === 'dark-theme');
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark-theme' : 'light-theme';
    applyTheme(defaultTheme);
}

themeBtn.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});

// themeBtnObserver
const themeBtnObserver = new MutationObserver(() => {
    const isDark = body.classList.contains('dark-theme');
    themeBtn.textContent = isDark ? '🌙' : '☀️';
    themeBtn.setAttribute('aria-pressed', isDark);
});

themeBtnObserver.observe(body, {
    attributes: true,
    attributeFilter: ['class']
});

// Links
const links = [
    { name: "last.fm", url: "https://www.last.fm/user/Diramix" },
    { name: "Pinterest", url: "https://pinterest.com/diram1x/" },
    { name: "Twitter", url: "https://x.com/Diram1x" },
    { name: "Discord", url: "https://discord.gg/ky6bcdy7KA" },
    { name: "Boosty", url: "https://boosty.to/diramix" },
    { name: "GitHub", url: "https://github.com/diramix/" },
    { name: "Spotify", url: "https://open.spotify.com/user/31aorysoanwbjcrfk2ikjfcl6pd4" }
];

const linksContainer = document.getElementById("topbarLinks");
const buttonsContainer = document.getElementById("topbarButtons");
const mobileContainer = document.getElementById("mobileLinks");

links.forEach((link, index) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "topbar-link";
    a.textContent = link.name;
    linksContainer.appendChild(a);

    const btn = document.createElement("button");
    btn.className = "topbar-button";
    btn.textContent = link.name;
    btn.addEventListener("click", () => window.open(link.url, "_blank"));
    buttonsContainer.appendChild(btn);

    const aMobile = document.createElement("a");
    aMobile.href = link.url;
    aMobile.target = "_blank";
    aMobile.className = "mobile-link";
    aMobile.textContent = link.name;
    mobileContainer.appendChild(aMobile);

    if (index < links.length - 1) {
        const sep = document.createElement("div");
        sep.className = "separator";
        mobileContainer.appendChild(sep);
    }
});