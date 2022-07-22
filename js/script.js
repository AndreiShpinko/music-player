const musicContainer = document.getElementById("music-container");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");

const audio = document.getElementById("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const title = document.getElementById("title");

const currentTimeEl = document.getElementById("time-current");
const durationEl = document.getElementById("time-duration");

// Song titles
const songs = ["hey", "summer", "ukulele"];

let songIndex = 0;
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
  audio.src = `music/${song}.mp3`;
  audio.addEventListener("canplaythrough", () => {
    title.innerText = song;
    let minutes = (audio.duration / 60) | 0;
    let seconds = Math.round(audio.duration) % 60;
    durationEl.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  });
}

let intervalID;
// Play song
function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  let isPlaying =
    audio.currentTime > 0 &&
    !audio.paused &&
    !audio.ended &&
    audio.readyState > audio.HAVE_CURRENT_DATA;

  if (!isPlaying) audio.play();

  intervalID = setInterval(() => {
    let minutes = (audio.currentTime / 60) | 0;
    let seconds = Math.round(audio.currentTime) % 60;
    currentTimeEl.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, 500);
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
  clearInterval(intervalID);
}

// Previous song
function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;

  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) songIndex = 0;

  loadSong(songs[songIndex]);
  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  let minutes = (audio.currentTime / 60) | 0;
  let seconds = Math.round(audio.currentTime) % 60;
  currentTimeEl.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("play");
  isPlaying ? pauseSong() : playSong();
});

// Change song
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Time/song update
audio.addEventListener("timeupdate", updateProgress);

// Click on progress bar
progressContainer.addEventListener("click", setProgress);

// Song ends
audio.addEventListener("ended", nextSong);
