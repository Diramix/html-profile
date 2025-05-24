function handleFirstButtonClick() {
    const bgVideo = document.getElementById('background-video');
    bgVideo.play();

    document.getElementById('apngStart').src = 'src/assets/intro3.png';

    const fb_container = document.getElementById('fb_container');
    fb_container.style.opacity = '0';
    fb_container.style.pointerEvents = 'none';

    const mainWrapper = document.querySelector('.hidden_control')
    mainWrapper.style.opacity = '1';
}
