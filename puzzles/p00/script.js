const TARGET_WORD = "RELIC";

const WHEEL_SETS = [
  ["R", "A", "S", "V"],
  ["E", "O", "U", "N"],
  ["L", "M", "T", "K"],
  ["I", "C", "P", "H"],
  ["C", "Y", "G", "D"]
];

const START_POSITIONS = [1, 2, 3, 1, 2];

const screenPrelog = document.getElementById("screen-prelog");
const screenPuzzle = document.getElementById("screen-puzzle");
const screenPostlog = document.getElementById("screen-postlog");

const toPuzzleButton = document.getElementById("to-puzzle-button");
const toPostlogButton = document.getElementById("to-postlog-button");
const transmitButton = document.getElementById("transmit-button");

const playPrelogAudioButton = document.getElementById("play-prelog-audio");
const playPostlogAudioButton = document.getElementById("play-postlog-audio");

const wheelLayer = document.getElementById("wheel-layer");
const cylinderImage = document.querySelector(".cylinder-image");
const solveMessage = document.getElementById("solve-message");
const audioToggle = document.getElementById("audio-toggle");

const badgeReferenceButton = document.getElementById("badge-reference-button");
const badgeModal = document.getElementById("badge-modal");
const badgeCloseButton = document.getElementById("badge-close");
const badgeZoomInButton = document.getElementById("badge-zoom-in");
const badgeZoomOutButton = document.getElementById("badge-zoom-out");
const badgeZoomResetButton = document.getElementById("badge-zoom-reset");
const badgeViewport = document.getElementById("badge-viewport");
const badgeFullImage = document.getElementById("badge-full-image");

const ambientAudio = document.getElementById("ambient-audio");
const clickAudio = document.getElementById("click-audio");
const postlogAudio = document.getElementById("postlog-audio");

const params = new URLSearchParams(window.location.search);
const start = params.get("start");

let wheels = [];
let currentPositions = [...START_POSITIONS];
let puzzleSolved = false;
let ambientMuted = false;
let ambientStarted = false;

let badgeScale = 1;
let badgeOffsetX = 0;
let badgeOffsetY = 0;
let badgeDragging = false;
let badgeDragStartX = 0;
let badgeDragStartY = 0;
let badgeStartOffsetX = 0;
let badgeStartOffsetY = 0;

function showScreen(screenToShow) {
  [screenPrelog, screenPuzzle, screenPostlog].forEach((screen) => {
    screen.classList.remove("screen--active");
  });

  screenToShow.classList.add("screen--active");
  window.scrollTo(0, 0);
}

function playAmbient() {
  if (ambientMuted || !ambientAudio) return;

  ambientAudio.volume = 0.28;

  const playPromise = ambientAudio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        ambientStarted = true;
      })
      .catch(() => {
        // Autoplay may be blocked until first interaction.
      });
  }
}

function ensureAmbientStarted() {
  if (ambientMuted || ambientStarted) return;
  playAmbient();
}

function stopAmbient() {
  if (!ambientAudio) return;
  ambientAudio.pause();
}

function toggleAmbient() {
  ambientMuted = !ambientMuted;

  if (ambientMuted) {
    stopAmbient();
    audioToggle.textContent = "🔇";
    audioToggle.setAttribute("aria-label", "Unmute ambient audio");
  } else {
    playAmbient();
    audioToggle.textContent = "🔊";
    audioToggle.setAttribute("aria-label", "Mute ambient audio");
  }
}

function playClick() {
  if (!clickAudio) return;

  clickAudio.pause();
  clickAudio.currentTime = 0;
  clickAudio.volume = 0.72;
  clickAudio.play().catch(() => {});
}

function buildWheelMarkup() {
  wheelLayer.innerHTML = "";
  wheels = [];

  WHEEL_SETS.forEach((letters, wheelIndex) => {
    const wheel = document.createElement("button");
    wheel.type = "button";
    wheel.className = "wheel";
    wheel.setAttribute("aria-label", `Rotate wheel ${wheelIndex + 1}`);

    const track = document.createElement("div");
    track.className = "wheel-track";

    const repeatingLetters = [...letters, ...letters];

    repeatingLetters.forEach((letter) => {
      const cell = document.createElement("div");
      cell.className = "wheel-letter";
      cell.textContent = letter;
      track.appendChild(cell);
    });

    wheel.appendChild(track);
    wheelLayer.appendChild(wheel);

    wheels.push({
      root: wheel,
      track,
      letters
    });
  });

  requestAnimationFrame(() => {
    sizeWheelLetters();
  });

  wheels.forEach((wheel, wheelIndex) => {
    wheel.root.addEventListener("click", () => {
      ensureAmbientStarted();
      rotateWheel(wheelIndex);
    });
  });
}

function sizeWheelLetters() {
  wheels.forEach((wheel, index) => {
    const wheelHeight = wheel.root.clientHeight;
    const normalizedPosition = currentPositions[index] % wheel.letters.length;

    wheel.track.querySelectorAll(".wheel-letter").forEach((cell) => {
      cell.style.height = `${wheelHeight}px`;
      cell.style.lineHeight = `${wheelHeight}px`;
    });

    wheel.track.style.transition = "none";
    wheel.track.style.transform = `translateY(-${normalizedPosition * wheelHeight}px)`;
  });
}

function getCurrentWord() {
  return currentPositions
    .map((position, index) => WHEEL_SETS[index][position % WHEEL_SETS[index].length])
    .join("");
}

function getCurrentWordAfterAdvance(changedIndex, nextPosition) {
  return currentPositions
    .map((position, index) => {
      const letters = WHEEL_SETS[index];
      const normalized = index === changedIndex
        ? nextPosition % letters.length
        : position % letters.length;
      return letters[normalized];
    })
    .join("");
}

function rotateWheel(index) {
  if (puzzleSolved) return;

  const wheel = wheels[index];
  const wheelHeight = wheel.root.clientHeight;
  const lettersPerWheel = wheel.letters.length;

  playClick();

  const previousPosition = currentPositions[index] % lettersPerWheel;
  const nextPosition = previousPosition + 1;

  currentPositions[index] = nextPosition;

  wheel.track.style.transition = "transform 0.18s ease-out";
  wheel.track.style.transform = `translateY(-${nextPosition * wheelHeight}px)`;

  const wordNow = getCurrentWordAfterAdvance(index, nextPosition);
  solveMessage.textContent = `Current alignment: ${wordNow}`;

  setTimeout(() => {
    if (nextPosition >= lettersPerWheel) {
      currentPositions[index] = 0;
      wheel.track.style.transition = "none";
      wheel.track.style.transform = "translateY(0px)";
    }

    checkSolved();
  }, 190);
}

function checkSolved() {
  const currentWord = getCurrentWord();

  if (currentWord === TARGET_WORD) {
    handleSolved();
    return;
  }

  solveMessage.classList.remove("solve-message--success");
}

function handleSolved() {
  puzzleSolved = true;

  solveMessage.textContent = "Cylinder unlocked. Archive fragment restored.";
  solveMessage.classList.add("solve-message--success");

  const wrapper = document.querySelector(".cylinder-wrapper");
  if (wrapper) {
    wrapper.classList.add("cylinder-wrapper--solved");
  }

  wheels.forEach((wheel) => {
    wheel.root.disabled = true;
    wheel.root.style.cursor = "default";
  });

  setTimeout(() => {
    toPostlogButton.classList.remove("hidden");
  }, 650);
}

function layoutPuzzleWheels() {
  requestAnimationFrame(() => {
    sizeWheelLetters();

    setTimeout(() => {
      sizeWheelLetters();
    }, 80);

    setTimeout(() => {
      sizeWheelLetters();
    }, 220);
  });
}

function enterPuzzleScreen() {
  showScreen(screenPuzzle);
  ensureAmbientStarted();

  if (cylinderImage && !cylinderImage.complete) {
    cylinderImage.addEventListener("load", layoutPuzzleWheels, { once: true });
  } else {
    layoutPuzzleWheels();
  }
}

function initPuzzle() {
  buildWheelMarkup();

  if (audioToggle) {
    audioToggle.addEventListener("click", toggleAmbient);
  }

  if (toPuzzleButton) {
    toPuzzleButton.addEventListener("click", () => {
      enterPuzzleScreen();
    });
  }

  if (toPostlogButton) {
    toPostlogButton.addEventListener("click", () => {
      showScreen(screenPostlog);
    });
  }

if (transmitButton) {
  transmitButton.addEventListener("click", () => {
    if (postlogAudio) {
      postlogAudio.pause();
      postlogAudio.currentTime = 0;
    }

    window.location.href = "../../archive.html?unlock=00";
  });
}

  if (playPrelogAudioButton) {
    playPrelogAudioButton.addEventListener("click", () => {
      ensureAmbientStarted();
    });
  }

if (playPostlogAudioButton && postlogAudio) {
  playPostlogAudioButton.addEventListener("click", () => {
    ensureAmbientStarted();

    if (postlogAudio.paused) {
      postlogAudio.play().then(() => {
        playPostlogAudioButton.textContent = "Pause Recording";
      }).catch(() => {});
    } else {
      postlogAudio.pause();
      playPostlogAudioButton.textContent = "Play Recording";
    }
  });

  postlogAudio.addEventListener("ended", () => {
    playPostlogAudioButton.textContent = "Play Recording";
  });
}

// ⬇️ ADD YOUR NEW BADGE CODE RIGHT HERE

if (badgeReferenceButton) {
  badgeReferenceButton.addEventListener("click", () => {
    openBadgeModal();
  });
}

if (badgeCloseButton) {
  badgeCloseButton.addEventListener("click", () => {
    closeBadgeModal();
  });
}

if (badgeModal) {
  badgeModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("badge-modal-backdrop")) {
      closeBadgeModal();
    }
  });
}

if (badgeZoomInButton) {
  badgeZoomInButton.addEventListener("click", () => {
    zoomBadge(0.15);
  });
}

if (badgeZoomOutButton) {
  badgeZoomOutButton.addEventListener("click", () => {
    zoomBadge(-0.15);
  });
}

if (badgeZoomResetButton) {
  badgeZoomResetButton.addEventListener("click", () => {
    resetBadgeView();
  });
}

if (badgeViewport) {
  badgeViewport.addEventListener("mousedown", (event) => {
    badgeDragging = true;
    badgeDragStartX = event.clientX;
    badgeDragStartY = event.clientY;
    badgeStartOffsetX = badgeOffsetX;
    badgeStartOffsetY = badgeOffsetY;
  });

  window.addEventListener("mousemove", (event) => {
    if (!badgeDragging) return;

    badgeOffsetX = badgeStartOffsetX + (event.clientX - badgeDragStartX);
    badgeOffsetY = badgeStartOffsetY + (event.clientY - badgeDragStartY);
    updateBadgeTransform();
  });

  window.addEventListener("mouseup", () => {
    badgeDragging = false;
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeBadgeModal();
  }
});

  if (start === "puzzle") {
  enterPuzzleScreen();
} else if (start === "postlog") {
  showScreen(screenPostlog);
} else {
  showScreen(screenPrelog);
}
}

function updateBadgeTransform() {
  if (!badgeFullImage) return;

  badgeFullImage.style.transform =
    `translate(calc(-50% + ${badgeOffsetX}px), calc(-50% + ${badgeOffsetY}px)) scale(${badgeScale})`;
}

function resetBadgeView() {
  badgeScale = 0.6;
  badgeOffsetX = 0;
  badgeOffsetY = 0;
  updateBadgeTransform();
}

function openBadgeModal() {
  if (!badgeModal) return;

  badgeModal.classList.remove("hidden");
  badgeModal.setAttribute("aria-hidden", "false");
  resetBadgeView();
}

function closeBadgeModal() {
  if (!badgeModal) return;

  badgeModal.classList.add("hidden");
  badgeModal.setAttribute("aria-hidden", "true");
}

function zoomBadge(delta) {
  badgeScale = Math.max(0.35, Math.min(3, badgeScale + delta));
  updateBadgeTransform();
}

initPuzzle();