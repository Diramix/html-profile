function handleFirstButtonClick() {
    // Starting bg video
    const bgVideo = document.getElementById('background-video');
    if (bgVideo) bgVideo.play();

    // Profile Decoration
    const profileDecoration = document.getElementById('apngStart');
    profileDecoration.src = './src/assets/profile/intro.png';

    setTimeout(() => {
        profileDecoration.src = './src/assets/profile/idle.png';
    }, 2000);

    // Showing controls
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
