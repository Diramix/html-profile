function handleFirstButtonClick() {
    const bgVideo = document.getElementById('background-video');
    bgVideo.style.zIndex = '-2';
    bgVideo.play();

    document.getElementById('apngStart').src = 'src/assets/intro3.png';

    const fb_container = document.getElementById('fb_container');
    fb_container.style.opacity = '0';
    fb_container.style.pointerEvents = 'none';
}
