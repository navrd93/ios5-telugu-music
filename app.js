const tracks = [
  { title: "Sravana Sandhya", artist: "Telugu Melodies", album: "Mana Paata", file: "audio/sravana-sandhya.wav", duration: "0:35" },
  { title: "Maanasa Raagam", artist: "Telugu Melodies", album: "Mana Paata", file: "audio/maanasa-raagam.wav", duration: "0:35" },
  { title: "Chandamama Katha", artist: "Kinnara Sangeetam", album: "Vennela Nights", file: "audio/chandamama-katha.wav", duration: "0:35" },
  { title: "Vennela Vaana", artist: "Kinnara Sangeetam", album: "Vennela Nights", file: "audio/vennela-vaana.wav", duration: "0:35" },
  { title: "Pranaya Geetam", artist: "Sangeetha Kiran", album: "Premalo", file: "audio/pranaya-geetam.wav", duration: "0:35" },
  { title: "Andala Pilla", artist: "Sangeetha Kiran", album: "Premalo", file: "audio/andala-pilla.wav", duration: "0:35" }
];

const audio = document.querySelector("#audio");
const playPause = document.querySelector("#playPause");
const progress = document.querySelector("#progress");
const elapsed = document.querySelector("#elapsed");
const duration = document.querySelector("#duration");
const nowScreen = document.querySelector("#nowScreen");
const libraryScreen = document.querySelector("#libraryScreen");
let current = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  seconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function loadTrack(index, autoplay = false) {
  current = (index + tracks.length) % tracks.length;
  const track = tracks[current];
  audio.src = track.file;
  document.querySelector("#trackTitle").textContent = track.title;
  document.querySelector("#trackArtist").textContent = track.artist;
  document.querySelector("#trackAlbum").textContent = track.album;
  progress.value = 0;
  elapsed.textContent = "0:00";
  duration.textContent = "-" + track.duration;
  playPause.classList.remove("paused");
  if (autoplay) audio.play().then(() => playPause.classList.add("paused")).catch(() => {});
}

function showScreen(screen) {
  nowScreen.classList.toggle("active", screen === "now");
  libraryScreen.classList.toggle("active", screen === "library");
  document.querySelector("#screenTitle").textContent = screen === "now" ? "Now Playing" : "Songs";
  document.querySelector("#navBack").style.visibility = screen === "library" ? "visible" : "hidden";
}

function renderSongs(filter = "") {
  const list = document.querySelector("#songList");
  list.innerHTML = "";
  tracks.forEach((track, index) => {
    if (!`${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(filter.toLowerCase())) return;
    const row = document.createElement("div");
    row.className = "song-row";
    row.innerHTML = `<div class="song-thumb"></div><div><div class="song-name">${track.title}</div><div class="song-artist">${track.artist}</div></div><div class="song-chevron">›</div>`;
    row.addEventListener("click", () => {
      loadTrack(index, true);
      showScreen("now");
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    });
    list.appendChild(row);
  });
}

playPause.addEventListener("click", () => {
  if (!audio.src) loadTrack(current);
  if (audio.paused) audio.play().then(() => playPause.classList.add("paused")).catch(() => {});
  else { audio.pause(); playPause.classList.remove("paused"); }
});
document.querySelector("#prevTrack").addEventListener("click", () => loadTrack(current - 1, true));
document.querySelector("#nextTrack").addEventListener("click", () => loadTrack(current + 1, true));

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime || 0;
  const total = audio.duration || 35;
  progress.value = total ? (currentTime / total) * 100 : 0;
  elapsed.textContent = formatTime(currentTime);
  duration.textContent = "-" + formatTime(Math.max(0, total - currentTime));
});
audio.addEventListener("ended", () => loadTrack(current + 1, true));
progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});
document.querySelector("#volume").addEventListener("input", event => audio.volume = Number(event.target.value));
document.querySelector("#songSearch").addEventListener("input", event => renderSongs(event.target.value));
document.querySelector("#navBack").addEventListener("click", () => showScreen("now"));

document.querySelectorAll(".tab").forEach((tab, index) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    if (index === 2) showScreen("library");
    else showScreen("now");
  });
});

audio.volume = 0.7;
renderSongs();
loadTrack(0);
document.querySelector(".tab[data-tab='songs']").classList.add("active");
