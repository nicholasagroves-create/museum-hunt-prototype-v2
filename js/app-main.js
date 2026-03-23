const appRoot = document.getElementById("app-root");

const humAudio = document.getElementById("terminal-hum-audio");
const typingAudio = document.getElementById("terminal-typing-audio");

const bootLines = [
  { type: "text", value: "MUSEUM EXPEDITION ARCHIVE v0.9.4" },
  { type: "text", value: "RECOVERED ACCESS NODE" },
  { type: "spacer" },
  { type: "loading", value: "Initializing secure research terminal" },
  { type: "loading", value: "Loading archive index" },
  { type: "loading", value: "Restoring damaged session fragments" },
  { type: "text", value: "Connection established." },
  { type: "spacer" }
];

let terminalState = {
  researcherId: "",
  createdPin: "",
  stage: "researcher-id"
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomTypeSpeed() {
  return 18 + Math.random() * 30;
}

function renderScreen(markup) {
  appRoot.innerHTML = markup;

  const screen = appRoot.firstElementChild;
  if (!screen) return;

  screen.classList.add("is-fading-in");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      screen.classList.add("is-fading-in-active");
    });
  });
}

function transitionTo(renderNextScreen, options = {}) {
  const { useCrtBurst = false, hardCut = false } = options;

  if (renderNextScreen === renderTerminalScreen) {
    startHum();
  }

  if (hardCut) {
    renderNextScreen();
    return;
  }

  appRoot.classList.add("is-fading-out");

  setTimeout(() => {
    appRoot.classList.remove("is-fading-out");

    if (useCrtBurst) {
      triggerCrtBurst(() => {
        renderNextScreen();
      });
      return;
    }

    renderNextScreen();
  }, 1200);
}

function setupAutoAdvance({ selector, duration, onAdvance }) {
  let hasAdvanced = false;

  function advance() {
    if (hasAdvanced) return;
    hasAdvanced = true;
    onAdvance();
  }

  const screen = document.querySelector(selector);

  if (screen) {
    screen.addEventListener("click", advance);
  }

  setTimeout(advance, duration);
}

function formatResearcherId(value) {
  const cleaned = value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 7);

  if (cleaned.length <= 4) {
    return cleaned;
  }

  return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
}

function triggerCrtBurst(onComplete) {
  const burst = document.createElement("div");
  burst.className = "crt-burst";

  document.body.appendChild(burst);

  setTimeout(() => {
    burst.remove();
    if (typeof onComplete === "function") {
      onComplete();
    }
  }, 420);
}

function startHum() {
  if (!humAudio) return;
  humAudio.volume = 0.25;
  humAudio.loop = true;
  humAudio.play().catch(() => {});
}

function stopHum() {
  if (!humAudio) return;
  humAudio.pause();
  humAudio.currentTime = 0;
}

function startTypingSound() {
  if (!typingAudio) return;
  typingAudio.volume = 0.35;

  if (typingAudio.paused) {
    typingAudio.currentTime = 0;
    typingAudio.play().catch(() => {});
  }
}

function stopTypingSound() {
  if (!typingAudio) return;
  typingAudio.pause();
  typingAudio.currentTime = 0;
}

async function typeCharacters(element, text) {
  startTypingSound();

  for (let i = 0; i < text.length; i += 1) {
    element.textContent += text.charAt(i);
    await wait(randomTypeSpeed());
  }

  stopTypingSound();
}

async function animateWorkingDots(element, baseText) {
  for (let cycle = 0; cycle < 3; cycle += 1) {
    element.textContent = baseText;
    await wait(220);

    element.textContent = `${baseText}.`;
    await wait(220);

    element.textContent = `${baseText}..`;
    await wait(220);

    element.textContent = `${baseText}...`;
    await wait(220);
  }

  await wait(250);
}

async function runBootSequence(output) {
  if (!output) return;

  await wait(1600);

  for (const lineData of bootLines) {
    if (lineData.type === "spacer") {
      const spacer = document.createElement("div");
      spacer.className = "terminal-line terminal-line--spacer";
      output.appendChild(spacer);
      await wait(140);
      continue;
    }

    const line = document.createElement("div");
    line.className = "terminal-line";
    output.appendChild(line);

    if (lineData.type === "text") {
      await typeCharacters(line, lineData.value);
      await wait(220);
      continue;
    }

    if (lineData.type === "loading") {
      await typeCharacters(line, lineData.value);
      await animateWorkingDots(line, lineData.value);
    }
  }
}

async function runPostLoginSequence() {
  const output = document.getElementById("terminal-output");
  const prompt = document.getElementById("terminal-prompt");

  if (!output || !prompt) return;

  prompt.style.visibility = "hidden";

  const line1 = document.createElement("div");
  line1.className = "terminal-line";
  output.appendChild(line1);
  await typeCharacters(line1, "Credentials verified.");
  await wait(400);

  const line2 = document.createElement("div");
  line2.className = "terminal-line";
  output.appendChild(line2);
  await typeCharacters(line2, "Loading Expedition Archive");
  await animateWorkingDots(line2, "Loading Expedition Archive");

  const line3 = document.createElement("div");
  line3.className = "terminal-line";
  output.appendChild(line3);
  await typeCharacters(line3, "Launching Interface");
  await animateWorkingDots(line3, "Launching Interface");

  stopHum();
  transitionTo(renderStudioScreen);
}

function addTerminalLine(text) {
  const output = document.getElementById("terminal-output");
  if (!output) return;

  const line = document.createElement("div");
  line.className = text === "" ? "terminal-line terminal-line--spacer" : "terminal-line";
  line.textContent = text;
  output.appendChild(line);
}

function setPrompt(promptText, inputMode = "text") {
  const promptLabel = document.querySelector(".terminal-prompt-text");
  const hiddenInput = document.getElementById("terminal-input");
  const inputDisplay = document.getElementById("terminal-input-display");

  if (!promptLabel || !hiddenInput || !inputDisplay) return;

  promptLabel.textContent = promptText;
  hiddenInput.value = "";
  inputDisplay.textContent = "";
  hiddenInput.setAttribute("inputmode", inputMode);
  hiddenInput.focus();
}

function maskPin(value) {
  return "•".repeat(value.length);
}

function renderStartScreen() {
  renderScreen(`
    <main class="app-screen app-screen--start">
      <div class="screen-shell start-screen">
        <div class="start-screen-content">
          <img
            src="media/studio/ascii-seal.png"
            alt="Archive Seal"
            class="start-seal-image"
          />
          <p class="start-message">CLICK ANYWHERE TO BEGIN</p>
        </div>
      </div>
    </main>
  `);

  const screen = document.querySelector(".start-screen");

  if (screen) {
    screen.addEventListener("click", () => {
      transitionTo(renderTerminalScreen, { useCrtBurst: true });
    });
  }
}

async function renderTerminalScreen() {
  terminalState = {
    researcherId: "",
    createdPin: "",
    stage: "researcher-id"
  };

  renderScreen(`
    <main class="app-screen">
      <div class="terminal-screen">
        <div class="terminal-window">
          <div class="terminal-output" id="terminal-output"></div>

          <div class="terminal-prompt" id="terminal-prompt">
            <span class="terminal-prompt-label">&gt;</span>
            <span class="terminal-prompt-text">ENTER RESEARCHER ID</span>
            <span id="terminal-input-display"></span>
            <span class="terminal-cursor"></span>
          </div>

          <input
            id="terminal-input"
            class="terminal-hidden-input"
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="characters"
            spellcheck="false"
            maxlength="8"
          />
        </div>
      </div>
    </main>
  `);

  const output = document.getElementById("terminal-output");
  const hiddenInput = document.getElementById("terminal-input");
  const inputDisplay = document.getElementById("terminal-input-display");
  const terminalWindow = document.querySelector(".terminal-window");
  const prompt = document.getElementById("terminal-prompt");

  if (!output || !hiddenInput || !inputDisplay || !terminalWindow || !prompt) return;

  prompt.style.visibility = "hidden";

  await runBootSequence(output);

  await wait(400);
  prompt.style.visibility = "visible";
  hiddenInput.focus();

  terminalWindow.addEventListener("click", () => {
    hiddenInput.focus();
  });

  hiddenInput.addEventListener("input", () => {
    if (terminalState.stage === "researcher-id") {
      const formattedValue = formatResearcherId(hiddenInput.value);
      hiddenInput.value = formattedValue;
      inputDisplay.textContent = formattedValue;
      return;
    }

    if (terminalState.stage === "create-pin" || terminalState.stage === "confirm-pin") {
      const pin = hiddenInput.value.replace(/\D/g, "").slice(0, 4);
      hiddenInput.value = pin;
      inputDisplay.textContent = maskPin(pin);
    }
  });

  hiddenInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    if (terminalState.stage === "researcher-id") {
      const researcherId = hiddenInput.value.trim();
      if (researcherId.length !== 8) return;

      terminalState.researcherId = researcherId;
      addTerminalLine(`> ENTER RESEARCHER ID ${researcherId}`);
      terminalState.stage = "create-pin";
      setPrompt("CREATE 4-DIGIT PIN", "numeric");
      return;
    }

    if (terminalState.stage === "create-pin") {
      const pin = hiddenInput.value.trim();
      if (pin.length !== 4) return;

      terminalState.createdPin = pin;
      addTerminalLine(`> CREATE 4-DIGIT PIN ${maskPin(pin)}`);
      terminalState.stage = "confirm-pin";
      setPrompt("CONFIRM 4-DIGIT PIN", "numeric");
      return;
    }

    if (terminalState.stage === "confirm-pin") {
      const pin = hiddenInput.value.trim();
      if (pin.length !== 4) return;

      addTerminalLine(`> CONFIRM 4-DIGIT PIN ${maskPin(pin)}`);

      if (pin !== terminalState.createdPin) {
        addTerminalLine("PIN MISMATCH. RE-ENTER NEW PIN.");
        terminalState.createdPin = "";
        terminalState.stage = "create-pin";
        setPrompt("CREATE 4-DIGIT PIN", "numeric");
        return;
      }

      terminalState.stage = "verified";
      runPostLoginSequence();
    }
  });
}

function renderThirdScreen() {
  renderScreen(`
    <main class="app-screen">
      <div class="screen-shell">
        <div class="screen-center">
          <h1 class="screen-title">Next Screen</h1>
          <p class="screen-text">Timed flow works.</p>
        </div>
      </div>
    </main>
  `);
}

const params = new URLSearchParams(window.location.search);
const screen = params.get("screen");

if (screen === "mercer-prelog") {
  renderMercerAudioJournalScreen();
} else {
  renderStartScreen();
}