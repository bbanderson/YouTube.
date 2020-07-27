const videos = document.querySelectorAll(".videoBlock__thumbnail");

let targetVideo = null;

const pauseVideo = () => {
    targetVideo.pause();
    targetVideo.currentTime = 1;
}

const handleTimeLimit = () => {
    setTimeout(pauseVideo, 2000)
    targetVideo.removeEventListener("play", handleTimeLimit)
    // video.removeEventListener("play", stopPreview)
}

const handleHoverForStop = () => {
    targetVideo.pause();
    targetVideo.currentTime = 1;
    targetVideo.removeEventListener("mouseleave", handleHoverForStop)
    targetVideo.addEventListener("mousemove", handleHoverForPlay)
}

const handleHoverForPlay = (event) => {
    targetVideo = event.target;
    targetVideo.currentTime = 0;
    targetVideo.muted = true;
    targetVideo.play();
    targetVideo.playbackRate = 10;
    targetVideo.addEventListener("play", handleTimeLimit)
    targetVideo.addEventListener("mouseleave",
        handleHoverForStop)
    targetVideo.removeEventListener("mousemove", handleHoverForPlay)
}

const init = () => {
    videos.forEach(video => {
        video.currentTime = 1;
        video.addEventListener("mousemove", handleHoverForPlay)
    })
}

if (videos) {
    init();
}