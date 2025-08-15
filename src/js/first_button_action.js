function handleFirstButtonClick() {
    const bgVideo = document.getElementById('background-video');
    if (bgVideo) bgVideo.play();

    document.getElementById('apngStart').src = 'https://cdn.discordapp.com/assets/profile_effects/effects/2025-08-06/kawaii_clouds/intro.png';

    const fb_container = document.getElementById('fb_container');
    fb_container.style.opacity = '0';
    fb_container.style.pointerEvents = 'none';

    const mainWrapper = document.querySelector('.hidden_control');
    mainWrapper.style.opacity = '1';
}

if (/Mobi|Android/i.test(navigator.userAgent)) {
    window.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById("background-video");
        if (video) video.remove();
    });
}
