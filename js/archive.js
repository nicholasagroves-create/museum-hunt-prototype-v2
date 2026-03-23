const intro = document.getElementById("archive-intro");
const introText = document.getElementById("archiveIntroText");
const archiveScreen = document.getElementById("archive-screen");
const archiveIndex = document.getElementById("archiveIndex");
const viewerLabel = document.getElementById("viewerLabel");
const viewerBody = document.getElementById("viewerBody");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalFrame = document.getElementById("modalFrame");

const introLines = [
  "INITIALIZING ARCHIVE...",
  "RESTORING RECORD INDEX...",
  "DECRYPTION LAYER STABLE...",
  "ACCESS GRANTED."
];

const params = new URLSearchParams(window.location.search);
const playIntro = params.get("intro") === "1";
const unlockId = params.get("unlock");

const RECOVERED_STORAGE_KEY = "museumArchiveRecovered";

function getRecoveredRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECOVERED_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function isRecordRecovered(id) {
  return getRecoveredRecords().includes(id);
}

function markRecordRecovered(id) {
  const recovered = getRecoveredRecords();
  if (!recovered.includes(id)) {
    recovered.push(id);
    localStorage.setItem(RECOVERED_STORAGE_KEY, JSON.stringify(recovered));
  }
}

/* =========================
   PATHS
========================= */

const JOURNAL1_URL = "app-root.html?screen=mercer-prelog";
const PUZZLE_URL = "puzzles/p00/index.html?start=puzzle";
const JOURNAL2_URL = "puzzles/p00/index.html?start=postlog";

/* NEW: Stone Wall */
const STONE_WALL_PRELOG_URL = "puzzles/p15/stone-wall-prelog.html";
const STONE_WALL_URL = "puzzles/p15/stone-wall.html";
const STONE_WALL_POSTLOG_URL = "puzzles/p15/stone-wall-postlog.html";

/* =========================
   EVENT CONFIG
========================= */

const eventData = {
  "19": {
    state: "completed",
    title: "Battle of the Brains"
  },
  "29": {
    state: "scheduled",
    title: "Orange Cat Trivia"
  },
  "41": {
    state: "scheduled",
    title: "Steel City Trivia"
  }
};

/* =========================
   INTRO
========================= */

function typeIntro(lines, index = 0) {
  if (!introText || !archiveScreen) return;

  if (index >= lines.length) {
    setTimeout(showArchive, 1200);
    return;
  }

  introText.innerHTML += `${lines[index]}<br>`;
  setTimeout(() => typeIntro(lines, index + 1), 900);
}

/* =========================
   ARCHIVE BUILD
========================= */

function buildArchiveList() {
  const titleRow = archiveIndex.querySelector(".archive-index__title");
  archiveIndex.innerHTML = "";
  archiveIndex.appendChild(titleRow);

  for (let i = 0; i <= 50; i++) {
    const id = String(i).padStart(2, "0");

    const row = document.createElement("div");
    row.className = "archive-file missing";
    row.dataset.id = id;

    let name = "Missing";

    if (id === "00") {
      row.id = "file-00";
    }

    /* NEW: record 15 exists in archive as missing but clickable */
if (id === "15") {
  row.id = "file-15";
  row.classList.add("archive-file--scan");
  row.onclick = () => openEventCard("15");
}

    if (eventData[id]) {
      row.classList.remove("missing");
      row.classList.add("event");
      name = eventData[id].title;
      row.onclick = () => openEventCard(id);
    }

if (id === "00" && isRecordRecovered("00")) {
  row.classList.remove("missing");
  row.classList.add("recovered");
  name = "Mercer Test Mechanism";
  row.onclick = () => openEventCard("00");
}

if (id === "15" && isRecordRecovered("15")) {
  row.classList.remove("missing");
  row.classList.remove("archive-file--scan");
  row.classList.add("recovered");
  name = "Stone Wall Sequence";
  row.onclick = () => openEventCard("15");
}

if (id === "15" && name === "Missing") {
  row.innerHTML = `
    <span class="archive-file__id">${id}</span>
    <span class="archive-file__name">Missing</span>
    <button
      class="archive-scan-btn"
      onclick="event.stopPropagation(); openStoneWallPrelog();"
    >
      Scan QR
    </button>
  `;
} else {
  row.innerHTML = `
    <span class="archive-file__id">${id}</span>
    <span class="archive-file__name">${name}</span>
  `;
}

    archiveIndex.appendChild(row);
  }
}

/* =========================
   MERCER UNLOCK
========================= */

function unlockMercer() {
  const row = document.getElementById("file-00");
  if (!row) return;

  row.classList.add("flash");

  setTimeout(() => {
    row.classList.remove("missing");
    row.classList.add("recovered");

    row.innerHTML = `
      <span class="archive-file__id">00</span>
      <span class="archive-file__name">Mercer Test Mechanism</span>
    `;

    row.onclick = () => openEventCard("00");
    markRecordRecovered("00");
    openEventCard("00");
  }, 800);
}

/* NEW: record 15 unlock */
function unlockRecord15() {
  const row = document.getElementById("file-15");
  if (!row) return;

  row.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    row.classList.add("flash");

    setTimeout(() => {
      row.classList.remove("missing");
      row.classList.add("recovered");

      row.innerHTML = `
        <span class="archive-file__id">15</span>
        <span class="archive-file__name">Stone Wall Sequence</span>
      `;

      row.onclick = () => openEventCard("15");
      markRecordRecovered("15");
      openEventCard("15");
    }, 800);
  }, 500);
}

/* =========================
   EVENT / RECORD PANEL
========================= */

function openEventCard(id) {
  viewerLabel.textContent = "Event Record";

  /* Mercer Test Mechanism (00) */
  if (id === "00") {
    viewerBody.innerHTML = `
      <div style="position:relative; display:flex; justify-content:center;">
        <img src="media/archive/mercer-card.png" style="width:90%; max-width:none;" alt="Mercer Test Mechanism" />

        <!-- LEFT: Journal 1 -->
        <div onclick="openJournal1()"
             style="
               position:absolute;
               left:12%;
               top:30%;
               width:20%;
               height:45%;
               cursor:pointer;
             ">
        </div>

        <!-- CENTER: Puzzle -->
        <div onclick="openReplayModal()"
             style="
               position:absolute;
               left:40%;
               top:28%;
               width:20%;
               height:48%;
               cursor:pointer;
             ">
        </div>

<!-- RIGHT: Post Log -->
<div onclick="openJournal2()"
     style="
       position:absolute;
       left:69%;
       top:28%;
       width:19%;
       height:48%;
       cursor:pointer;
     ">
</div>
      </div>
    `;
    return;
  }

  /* NEW: Stone Wall Sequence (15) */
  if (id === "15") {
    const row = document.getElementById("file-15");
    const isRecovered = row && row.classList.contains("recovered");

    viewerLabel.textContent = "Archive Record";

if (isRecovered) {
  viewerBody.innerHTML = `
    <div style="position:relative; display:flex; justify-content:center;">
      <img src="media/archive/stone-wall-card.png" 
           style="width:90%; max-width:none;" 
           alt="Stone Wall Sequence" />

      <!-- LEFT: Prelog -->
      <div onclick="openStoneWallPrelog()"
           style="
             position:absolute;
             left:12%;
             top:30%;
             width:20%;
             height:45%;
             cursor:pointer;
           ">
      </div>

      <!-- CENTER: Puzzle -->
      <div onclick="openStoneWallReplay()"
           style="
             position:absolute;
             left:40%;
             top:28%;
             width:20%;
             height:48%;
             cursor:pointer;
           ">
      </div>

      <!-- RIGHT: Post Log -->
      <div onclick="openStoneWallPostlog()"
           style="
             position:absolute;
             left:68%;
             top:30%;
             width:20%;
             height:45%;
             cursor:pointer;
           ">
      </div>
    </div>
  `;
} else {
      viewerBody.innerHTML = `
        <div style="position:relative; display:flex; justify-content:center;">
          <div style="width:90%; border:1px solid rgba(255,255,255,0.14); padding:24px; background:rgba(255,255,255,0.03);">
            <h3 style="margin-top:0;">15</h3>
            <p>Status: Missing</p>
            <p>Field record not yet recovered.</p>

            <div style="margin-top:18px;">
              <button onclick="openStoneWallPrelog()">Scan QR</button>
            </div>
          </div>
        </div>
      `;
    }
    return;
  }

  const data = eventData[id];
  if (!data) return;

  /* Orange Cat */
  if (id === "29") {
    viewerBody.innerHTML = `
      <div style="position:relative; display:flex; justify-content:center;">
        <img src="media/archive/orangecat-card.png" style="width:90%; max-width:none;" alt="Orange Cat Trivia" />

        <div onclick="openScanModal()"
             style="
               position:absolute;
               bottom:40px;
               left:50%;
               transform:translateX(-50%);
               width:140px;
               height:140px;
               cursor:pointer;
             ">
        </div>
      </div>
    `;
    return;
  }

  /* Steel City */
  if (id === "41") {
    viewerBody.innerHTML = `
      <div style="position:relative; display:flex; justify-content:center;">
        <img src="media/archive/steelcity-card.png" style="width:90%; max-width:none;" alt="Steel City Trivia" />

        <div onclick="openScanModal()"
             style="
               position:absolute;
               bottom:40px;
               left:50%;
               transform:translateX(-50%);
               width:140px;
               height:140px;
               cursor:pointer;
             ">
        </div>
      </div>
    `;
    return;
  }

  /* Battle of the Brains */
  if (id === "19") {
    viewerBody.innerHTML = `
      <div style="position:relative; display:flex; justify-content:center;">
        <img src="media/archive/battlebrains-card.png" style="width:90%; max-width:none;" alt="Battle of the Brains" />

        <div onclick="openQRModal()"
             style="
               position:absolute;
               bottom:120px;
               left:50%;
               transform:translateX(-50%);
               width:180px;
               height:180px;
               cursor:pointer;
             ">
        </div>
      </div>
    `;
    return;
  }
}

/* =========================
   MODAL HELPERS
========================= */

function openFrameModal(src, zoomLevel = 1.2) {
  modalContent.innerHTML = `
    <button class="modal-close-btn" onclick="closeModal()">×</button>
    <iframe id="modalFrame" class="modal-frame" src="${src}"></iframe>
  `;

  modal.classList.remove("hidden");

  const frame = document.getElementById("modalFrame");

  frame.addEventListener("load", () => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      if (!doc) return;

      const html = doc.documentElement;
      const body = doc.body;

      html.style.background = "#000";
      html.style.height = "100%";

      body.style.margin = "0";
      body.style.background = "#000";
      body.style.zoom = String(zoomLevel);
      body.style.transformOrigin = "top center";
      body.style.minHeight = "100%";
    } catch (err) {
      console.warn("Could not adjust iframe zoom:", err);
    }
  });
}

function openScanModal() {
  modalContent.innerHTML = `
    <button class="modal-close-btn" onclick="closeModal()">×</button>
    <div style="padding: 8px 8px 0;">
      <h3>Scan Unlock Code</h3>
      <p>Use your device camera to scan the QR code provided at the event.</p>
      <img src="media/archive/scan-button.png" style="width:180px;" alt="Scan Unlock Code" />
    </div>
  `;
  modal.classList.remove("hidden");
}

function openQRModal() {
  modalContent.innerHTML = `
    <button class="modal-close-btn" onclick="closeModal()">×</button>
    <div style="padding: 8px 8px 0;">
      <h3>Recovered QR Code</h3>
      <p>Hold your screen steady so another player can scan.</p>
      <img src="media/archive/battlebrains-qr.png" alt="Battle of the Brains QR Code" style="width:280px; display:block; margin:18px auto 0;" />
    </div>
  `;
  modal.classList.remove("hidden");
}

function openJournal1() {
  openFrameModal(JOURNAL1_URL, 1.22);
}

function openJournal2() {
  openFrameModal(JOURNAL2_URL, 1.22);
}

function openReplayModal() {
  openFrameModal(PUZZLE_URL, 1.12);
}

/* NEW: Stone Wall navigation uses full page load */
function openStoneWallPrelog() {
  window.location.href = STONE_WALL_PRELOG_URL;
}

function openStoneWallReplay() {
  window.location.href = STONE_WALL_URL;
}

function openStoneWallPostlog() {
  window.location.href = STONE_WALL_POSTLOG_URL;
}

function closeModal() {
  modal.classList.add("hidden");
  modalContent.innerHTML = "";
}

/* =========================
   SHOW ARCHIVE
========================= */

function showArchive() {
  if (intro) intro.style.display = "none";

  archiveScreen.classList.remove("hidden");
  archiveScreen.style.display = "block";

  requestAnimationFrame(() => {
    archiveScreen.classList.add("visible");
  });

  buildArchiveList();

if (unlockId === "00" && !isRecordRecovered("00")) {
  setTimeout(() => {
    unlockMercer();
  }, 700);
} else if (unlockId === "00" && isRecordRecovered("00")) {
  setTimeout(() => {
    const row = document.getElementById("file-00");
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    openEventCard("00");
  }, 300);
}

if (unlockId === "15" && !isRecordRecovered("15")) {
  setTimeout(() => {
    unlockRecord15();
  }, 1200);
} else if (unlockId === "15" && isRecordRecovered("15")) {
  setTimeout(() => {
    const row = document.getElementById("file-15");
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    openEventCard("15");
  }, 300);
}
}

/* =========================
   INIT
========================= */

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeModal);
}

if (playIntro) {
  typeIntro(introLines);
} else {
  showArchive();
}

/* expose for inline click */
window.openScanModal = openScanModal;
window.closeModal = closeModal;
window.openQRModal = openQRModal;
window.openJournal1 = openJournal1;
window.openJournal2 = openJournal2;
window.openReplayModal = openReplayModal;
window.openStoneWallPrelog = openStoneWallPrelog;
window.openStoneWallReplay = openStoneWallReplay;
window.openStoneWallPostlog = openStoneWallPostlog;