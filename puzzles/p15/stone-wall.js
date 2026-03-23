const SOLUTION = ["fire", "water", "leaf", "moon"];

const buttonClickAudio = document.getElementById("click-audio");
const successAudio = document.getElementById("success-audio");
const wrongAudio = document.getElementById("wrong-audio");

const stoneButtons = Array.from(document.querySelectorAll(".stone-btn"));
const sequenceReadout = document.getElementById("sequence-readout");
const statusMessage = document.getElementById("status-message");
const resetButton = document.getElementById("reset-button");
const continueButton = document.getElementById("continue-button");
const backButton = document.getElementById("back-button");
const puzzleScene = document.querySelector(".stonewall-image-wrap");
const referenceHitbox = document.getElementById("reference-hitbox");
const referenceModal = document.getElementById("reference-modal");
const referenceBackdrop = document.getElementById("reference-backdrop");

let currentSequence = [];
let solved = false;

function playAudio(audioEl, volume = 1) {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.currentTime = 0;
  audioEl.volume = volume;
  audioEl.play().catch(() => {});
}

function formatSequence(sequence) {
  if (!sequence.length) return "—";
  return sequence.join(" → ");
}

function updateSequenceReadout() {
  sequenceReadout.textContent = `Sequence: ${formatSequence(currentSequence)}`;
}

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.classList.remove("is-success", "is-error");

  if (type === "success") statusMessage.classList.add("is-success");
  if (type === "error") statusMessage.classList.add("is-error");
}

function clearPressedStates() {
  stoneButtons.forEach((button) => {
    button.classList.remove("pressed");
  });
}

function resetSequence() {
  if (solved) return;

  currentSequence = [];
  clearPressedStates();
  updateSequenceReadout();
  setStatus("Awaiting input.");
}

function lockPuzzle() {
  solved = true;
  stoneButtons.forEach((button) => {
    button.disabled = true;
  });
}

function handleSolved() {
  lockPuzzle();
  playAudio(successAudio, 0.8);
  setStatus("Sequence accepted. Record restored.", "success");

  if (puzzleScene) {
    puzzleScene.classList.add("success");
  }

  setTimeout(() => {
    if (puzzleScene) {
      puzzleScene.classList.remove("success");
    }
    continueButton.classList.remove("hidden");
  }, 1400);
}

function handleWrong() {
  setStatus("Incorrect sequence. Reset and observe the wall carefully.", "error");

  // Delay the buzz so it follows the 4th button click sound
  setTimeout(() => {
    playAudio(wrongAudio, 0.45);
  }, 1300);

  setTimeout(() => {
    if (!solved) {
      playAudio(buttonClickAudio, 0.6); // reset sound
      resetSequence();
    }
  }, 2000);
}

function handleStoneClick(button) {
  if (solved) return;
  if (currentSequence.length >= SOLUTION.length) return;

  const symbol = button.dataset.symbol;
  if (!symbol) return;

  playAudio(buttonClickAudio, 0.7);

  currentSequence.push(symbol);
  button.classList.add("pressed");

  updateSequenceReadout();

  if (currentSequence.length < SOLUTION.length) {
    setStatus("Sequence recorded. Continue.");
    return;
  }

  const isCorrect = currentSequence.join("|") === SOLUTION.join("|");

  if (isCorrect) {
    handleSolved();
  } else {
    handleWrong();
  }
}

function goToPostlog() {
  window.location.href = "stone-wall-postlog.html";
}

function goToPrelog() {
  window.location.href = "stone-wall-prelog.html";
}

function openReference() {
  referenceModal.classList.remove("hidden");
}

function closeReference() {
  referenceModal.classList.add("hidden");
}

stoneButtons.forEach((button) => {
  if (button.dataset.symbol) {
    button.addEventListener("click", () => handleStoneClick(button));
  }
});

if (resetButton) {
  resetButton.addEventListener("click", resetSequence);
}

if (continueButton) {
  continueButton.addEventListener("click", goToPostlog);
}

if (backButton) {
  backButton.addEventListener("click", goToPrelog);
}

if (referenceHitbox) {
  referenceHitbox.addEventListener("click", openReference);
}

if (referenceBackdrop) {
  referenceBackdrop.addEventListener("click", closeReference);
}

updateSequenceReadout();
setStatus("Awaiting input.");