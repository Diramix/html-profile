function handleFirstButtonClick() {
    const bgVideo = document.getElementById('background-video');
    bgVideo.play();

    const fb_container = document.getElementById('first_button');
    fb_container.style.opacity = '0';
    fb_container.style.pointerEvents = 'none';
}
