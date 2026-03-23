const postlogAudioButton = document.getElementById("postlog-audio-button");
const postlogTransmitButton = document.getElementById("postlog-transmit-button");
const postlogAudio = document.getElementById("postlog-audio");

function playPostlogAudio() {
  if (!postlogAudio) return;

  postlogAudio.pause();
  postlogAudio.currentTime = 0;
  postlogAudio.volume = 0.9;
  postlogAudio.play().catch(() => {});
}

function transmitRecovery() {
  localStorage.setItem("stone-wall", "solved");
  window.location.href = "../../archive.html?unlock=15";
}

if (postlogAudioButton) {
  postlogAudioButton.addEventListener("click", playPostlogAudio);
}

if (postlogTransmitButton) {
  postlogTransmitButton.addEventListener("click", transmitRecovery);
}