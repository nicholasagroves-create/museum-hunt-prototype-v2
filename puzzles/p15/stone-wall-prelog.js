const prelogAudioButton = document.getElementById("prelog-audio-button");
const prelogBeginButton = document.getElementById("prelog-begin-button");
const prelogAudio = document.getElementById("prelog-audio");

function playPrelogAudio() {
  if (!prelogAudio) return;

  prelogAudio.pause();
  prelogAudio.currentTime = 0;
  prelogAudio.volume = 0.9;
  prelogAudio.play().catch(() => {});
}

function goToPuzzle() {
  window.location.href = "stone-wall.html";
}

if (prelogAudioButton) {
  prelogAudioButton.addEventListener("click", playPrelogAudio);
}

if (prelogBeginButton) {
  prelogBeginButton.addEventListener("click", goToPuzzle);
}