const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Waiting for loading
const loader = document.getElementById("loader");
const loadingWrapper = document.getElementById("loadingWrapper");

const requiredFiles = [
    "https://github.com/Diramix/html-profile/releases/download/666.void.scream/music.mp3",
];

if (!isMobile) {
    requiredFiles.push(
        "https://github.com/Diramix/html-profile/releases/download/666.void.scream/bg.webp",
    );
}

let loaded = 0;

function updateLoader() {
    loaded++;
    const percent = Math.round((loaded / requiredFiles.length) * 100);
    loader.textContent = `Loading: ${percent}%`;
    if (loaded === requiredFiles.length) {
        loadingWrapper.style.display = "none";
    }
}

requiredFiles.forEach((src) => {
    const isMedia = /\.(mp4|mp3|ogg|wav|webm)$/i.test(src);
    const element = document.createElement(isMedia ? "video" : "img");
    element.onloadeddata = updateLoader;
    element.onerror = updateLoader;
    element.src = src;
    if (isMedia) element.preload = "auto";
});

// Gecko check
if (
    navigator.userAgent.includes("Gecko") &&
    !navigator.userAgent.includes("WebKit")
) {
    document.documentElement.classList.add("gecko");
}

// Получение README.md
const handleReleaseError = () => {
    console.error("Error fetching release data");

    const descriptionElement = document.querySelector(".description");
    if (descriptionElement) {
        descriptionElement.textContent = "Unknown";
        descriptionElement.style.color = "red";
    }

    const background_videoElement = document.querySelector(".background_video");
    if (background_videoElement) {
        background_videoElement.style.background =
            "linear-gradient(180deg, #F00 0%, #000d1a 100%)";
    }

    const latestElements = document.querySelectorAll("#ab_latest");
    latestElements.forEach((element) => (element.style.display = "none"));

    const skillIssuesElements = document.querySelectorAll(".skill_issues");
    skillIssuesElements.forEach((element) => (element.style.display = "none"));
};

const fetchReleaseData = () => {
    fetch(
        "https://raw.githubusercontent.com/Diramix/Diramix/refs/heads/main/README.md",
    )
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch README.md");
            return response.text();
        })
        .then((data) => updateDescription(data))
        .catch(handleReleaseError);
};

const updateDescription = (description) => {
    const converter = new showdown.Converter({
        simplifiedAutoLink: true,
        openLinksInNewWindow: true,
    });
    const htmlDescription = converter.makeHtml(description || "");
    const descriptionElement = document.querySelector(".description");
    if (descriptionElement) {
        descriptionElement.innerHTML = htmlDescription;
    }
};

fetchReleaseData();

// Pin track on iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    const elements = document.querySelectorAll(".notForIOS");
    elements.forEach((el) => (el.style.display = "none"));
}

// upm
const member = document.querySelector(".member");
const upmWrapper = document.querySelector(".upm_wrapper");
const upm = document.querySelector(".upm");

member.addEventListener("click", (e) => {
    if (upmWrapper.style.display === "flex") {
        if (e.target === upmWrapper) {
            upmWrapper.style.display = "none";
            upm.style.display = "none";
        }
    } else {
        upmWrapper.style.display = "flex";
        upm.style.display = "flex";
    }
});

// Expand button
const btn = document.querySelector(".expand_button");
const fav = document.querySelector(".fav_user_container");

btn.addEventListener("click", () => {
    fav.classList.toggle("active");
    btn.querySelector(".arrow").classList.toggle("rotated");
});

// Fade Volume
let mediaElements = document.querySelectorAll(
    ".track-audio, .background_video",
);

mediaElements.forEach((media) => {
    media.fadeInInterval = null;
    media.fadeOutInterval = null;

    media.addEventListener("play", function () {
        mediaElements.forEach((el) => {
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

    media.addEventListener("pause", function () {
        mediaElements.forEach((el) => {
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

    media.addEventListener("ended", function () {
        mediaElements.forEach((el) => {
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
    .then((response) => response.text())
    .then((text) => {
        splashes = text.split("\n").filter((line) => line.trim() !== "");
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

// Fading profile_container
let mainContainer = document.querySelector(".profile_container");
let timeoutId;
let isHidden = false;
let players = new Map();

function hideContainer() {
    if (isMobile || isAnyVideoPlaying()) return;
    mainContainer.style.transition = "opacity 5s";
    mainContainer.style.opacity = "0";
    isHidden = true;
}

function showContainer() {
    if (isHidden) {
        mainContainer.style.transition = "opacity 0.3s";
        mainContainer.style.opacity = "1";
        isHidden = false;
    }
}

function resetTimer() {
    if (isMobile || isAnyVideoPlaying()) {
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

document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
document.addEventListener("touchmove", resetTimer);
document.addEventListener("click", resetTimer);
document.addEventListener("scroll", resetTimer, { passive: true });

document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget || e.relatedTarget.nodeName === "HTML") {
        timeoutId = setTimeout(() => {
            if (!isMobile && !isAnyVideoPlaying()) {
                hideContainer();
            }
        }, 10000);
    }
});

resetTimer();

function isAnyVideoPlaying() {
    for (const player of players.values()) {
        const state = player.getPlayerState();
        if (state === 1) return true;
    }
    return false;
}

function loadYouTubeAPI(callback) {
    if (window.YT && window.YT.Player) {
        callback();
    } else {
        let tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => callback();
    }
}

function setupPlayers() {
    document.querySelectorAll("iframe.youtube_embed").forEach((iframe) => {
        if (!players.has(iframe)) {
            const player = new YT.Player(iframe, {
                events: {
                    onStateChange: resetTimer,
                },
            });
            players.set(iframe, player);
        }
    });
}

loadYouTubeAPI(setupPlayers);

// Theme control
const video = document.getElementById("background-video");
const muteBtn = document.getElementById("mute-btn");
const themeButtons = document.querySelectorAll(".toggle-theme-btn");
const body = document.body;

// Mute Button
if (/Mobi|Android/i.test(navigator.userAgent)) {
    video.muted = true;
    muteBtn.classList.add("active");
    muteBtn.textContent = "🔇";
    muteBtn.setAttribute("aria-pressed", true);
}

muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.classList.toggle("active", video.muted);
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
    muteBtn.setAttribute("aria-pressed", video.muted);
});

// Change the gender!
function applyTheme(theme) {
    body.classList.remove("light-theme", "dark-theme");
    body.classList.add(theme);
    const isDark = theme === "dark-theme";
    themeButtons.forEach((btn) => {
        btn.textContent = isDark ? "🌙" : "☀️";
        btn.setAttribute("aria-pressed", isDark);
    });
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;
    const defaultTheme = prefersDark ? "dark-theme" : "light-theme";
    applyTheme(defaultTheme);
}

function toggleTheme() {
    const newTheme = body.classList.contains("dark-theme")
        ? "light-theme"
        : "dark-theme";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
}

themeButtons.forEach((btn) => btn.addEventListener("click", toggleTheme));

const themeObserver = new MutationObserver(() => {
    const isDark = body.classList.contains("dark-theme");
    themeButtons.forEach((btn) => {
        btn.textContent = isDark ? "🌙" : "☀️";
        btn.setAttribute("aria-pressed", isDark);
    });
});

themeObserver.observe(body, { attributes: true, attributeFilter: ["class"] });

// You Modal
document.addEventListener("DOMContentLoaded", () => {
    const youBar = document.querySelector(".you_bar");
    const modal = document.getElementById("you_modal");
    const overlay = document.getElementById("you_overlay");
    let startY = 0,
        currentY = 0,
        diffY = 0,
        isDragging = false;
    let modalHeight = 0;
    let closeTimeout = null;
    let currentTranslate = 0;

    const setOverlayOpacity = (y) => {
        const ratio = Math.max(0, Math.min(1, 1 - y / modalHeight));
        overlay.style.opacity = ratio;
        if (ratio > 0 && !overlay.classList.contains("active"))
            overlay.classList.add("active");
        if (ratio === 0 && overlay.classList.contains("active"))
            overlay.classList.remove("active");
    };

    const openModal = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        overlay.classList.add("active");
        overlay.style.opacity = "1";
        modalHeight = modal.offsetHeight;
        currentTranslate = 0;
        modal.style.transition = "none";
        modal.style.transform = "translateY(100%)";
        requestAnimationFrame(() => {
            modal.classList.add("active");
            modal.style.transition = "transform 0.4s ease";
            modal.style.transform = "translateY(0)";
        });
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modalHeight = modal.offsetHeight;
        modal.style.transition = "transform 0.4s ease";
        modal.style.transform = "translateY(100%)";
        overlay.style.transition = "opacity 0.4s ease";
        overlay.style.opacity = "0";
        closeTimeout = setTimeout(() => {
            modal.classList.remove("active");
            overlay.classList.remove("active");
            overlay.style.transition = "";
            document.body.style.overflow = "";
            closeTimeout = null;
            currentTranslate = 0;
        }, 400);
    };

    youBar.addEventListener("click", (e) => {
        if (e.currentTarget === e.target) openModal();
    });

    overlay.addEventListener("click", closeModal);

    modal.addEventListener("touchstart", (e) => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        startY = e.touches[0].clientY;
        isDragging = true;
        modal.style.transition = "none";
        overlay.style.transition = "none";
        modalHeight = modal.offsetHeight;
        overlay.classList.add("active");
    });

    modal.addEventListener(
        "touchmove",
        (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            diffY = currentY - startY;
            let translateY = Math.max(0, currentTranslate + diffY);
            modal.style.transform = `translateY(${translateY}px)`;
            setOverlayOpacity(translateY);
        },
        { passive: false },
    );

    modal.addEventListener("touchend", () => {
        isDragging = false;
        currentTranslate += diffY;
        modal.style.transition = "transform 0.3s ease";
        overlay.style.transition = "opacity 0.3s ease";
        if (currentTranslate > 50) {
            closeModal();
        } else {
            currentTranslate = 0;
            modal.style.transform = "translateY(0)";
            overlay.style.opacity = "1";
        }
        diffY = 0;
    });
});

// fav track parser
async function fetchJson() {
    const jsonUrl = "src/assets/fav-track.json";
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

fetchJson()
    .then((track) => {
        const container = document.querySelector(".track_card");
        container.querySelector(".track_cover").src = track.cover;
        container.querySelector(".track_title").textContent = track.title;
        container.querySelector(".activity_title").textContent = track.title;
        container.querySelector(".track_artist").textContent = track.artist;
        container.querySelector(".activity_artist").textContent = track.artist;
        container.querySelector("audio source").src = track.audio;
        container.querySelector("audio").load();
        container.querySelector(".track_cover_mobile").style.backgroundImage =
            `url(${track.cover})`;
    })
    .catch((err) => console.error(err));

// Timestamp
function getMoscowTime() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const moscowOffset = 3 * 60;
    const moscowTime = new Date(utc + moscowOffset * 60000);
    return moscowTime;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function updateTimestamps() {
    const elements = document.querySelectorAll(".ds_activity_meta_timestamp");
    const timeString = formatTime(getMoscowTime());
    elements.forEach((el) => {
        el.textContent = timeString;
    });
}

setInterval(updateTimestamps, 1000);

updateTimestamps();
