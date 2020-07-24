import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const controller = document.querySelector("#js-controller");
const progress = document.querySelector(".progress");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

let currentTimeNum = 0.0;
let duration = 0.1;

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleKeyDown(event) {
  // console.log(event.key);
  if (event.key === " ") {
    if (videoPlayer.paused) {
      videoPlayer.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      videoPlayer.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }
}



function handleVolumeBtnClick() {
  if (videoPlayer.muted) {
    const value = videoPlayer.volume;
    videoPlayer.muted = false;
    if (value >= 0.6) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value >= 0.2) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
    // volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function exitFullScreen() {
  // fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// ********** Hide & Seek **********

function hiding() {
  controller.style.opacity = 0;
  videoContainer.style.cursor = "none";
}

function handleHideController() {
  setTimeout(hiding, 5000);
  controller.style.opacity = 1;
  videoContainer.style.cursor = "inherit";
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let second = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (second < 10) {
    second = `0${second}`;
  }
  return `${hours}:${minutes}:${second}`;
};

function getCurrentTime() {
  const before = videoPlayer.currentTime;
  currentTimeNum = before;
  const after = formatDate(Math.floor(before));
  currentTime.innerHTML = after;
  progress.value = (currentTimeNum / duration) * 100;
}

async function setTotalTime() {
  const blob = await fetch(videoPlayer.src, {
    mode: "cors",
  }).then((response) => response.blob());
  duration = await getBlobDuration(blob);
  const totalTimeString = formatDate(duration);
  totalTime.innerHTML = totalTimeString;
  // currentTime = "00:00"
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
  const {
    target: {
      value
    },
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

function handleProgressClick(event) {
  const userClicked = event.target.value;
  videoPlayer.currentTime = (userClicked / 100) * duration;
}

function init() {
  // Play & Pause
  playBtn.addEventListener("click", handlePlayClick);
  document.addEventListener("keydown", handleKeyDown);
  // Volume
  videoPlayer.volume = 0.5;
  volumeBtn.addEventListener("click", handleVolumeBtnClick);
  // Full Screen
  fullScrnBtn.addEventListener("click", goFullScreen);
  // Time
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  if (videoPlayer.readyState >= 2) {
    setTotalTime();
  }
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
  // Mouse Hover
  videoContainer.addEventListener("pointermove", handleHideController);
  // Progress
  progress.addEventListener("input", handleProgressClick);

}

if (videoContainer) {
  init();
}