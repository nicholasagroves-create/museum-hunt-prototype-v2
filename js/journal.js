function renderMercerAudioJournalScreen() {
  renderScreen(`
    <main class="app-screen journal-screen">
      <div class="journal-artifact">
        <div class="journal-overlay">

          <div class="journal-title">Mercer Audio Log</div>
          <div class="journal-subtitle">Recovered Transcript — Tutorial Record</div>

          <div class="journal-audio-controls">
            <button id="journal-audio-toggle" class="journal-audio-button">Play Audio</button>
            <div id="journal-audio-status" class="journal-audio-status">Audio Paused</div>
          </div>

          <div class="journal-transcript-wrap">
            <div class="journal-transcript">
              <p>“If this recording is active, then the archive is still responding.</p>

              <p>Good.</p>

              <p>That means someone made it far enough to trigger a recovery.</p>

              <p>Listen carefully. I don’t know who you are, or how much time you have, so I’m going to keep this simple.</p>

              <p>What we found here… it isn’t part of the museum.</p>

              <p>The mechanisms—those devices you’ll start to notice—they weren’t installed. They appeared. Embedded into the structure, like they’ve always been here, waiting.</p>

              <p>We think they’re tied to something older. Not an artifact. Not a collection.</p>

              <p>A system.</p>

              <p>One that forms when enough knowledge is gathered in a single place.</p>

              <p>And if we’re right… it’s not preserving knowledge.</p>

              <p>It’s testing it.</p>

              <p>Testing us.</p>

              <p>There’s a central mechanism—larger than the others. Incomplete. It requires a set of fragments… artifacts, for lack of a better word. We’ve found evidence of them, but not all of them.</p>

              <p>We believed that assembling them would unlock something.</p>

              <p>Now… I’m not sure that’s a good idea.</p>

              <p>If you’re continuing where we left off, proceed carefully. We made assumptions. We moved too quickly. Don’t repeat that.</p>

              <p>The mechanisms don’t respond to force. Or guesswork.</p>

              <p>They respond to observation.</p>

              <p>Everything you need is already in front of you. The environment, the displays, the details most people ignore—that’s where the answers live.</p>

              <p>Start with something simple.</p>

              <p>You should have a field credential. A badge.</p>

              <p>Look at it.</p>

              <p>Not casually. Intentionally.</p>

              <p>The first mechanism you encounter—a cylinder, rotating segments—that one’s mine. I built it to train the team. To force them to stop searching… and start seeing.</p>

              <p>The solution isn’t in the device.</p>

              <p>It’s on you.</p>

              <p>Align it correctly, and the archive will respond. It always does.</p>

              <p>After that… the system opens up.</p>

              <p>Piece by piece.</p>

              <p>Just remember—this place isn’t hiding anything from you.</p>

              <p>But it will let you misunderstand everything if you’re not paying attention.</p>

              <p>Good luck.</p>

              <p>Be careful.</p>

              <p>And whatever you do…</p>

              <p>pay attention to the world around you.”</p>
            </div>
          </div>

          <div class="journal-footer">
            <div class="journal-footer-note">Recovered by Archive Curation Division</div>
            <button id="journal-continue" class="journal-continue-button">Begin Mercer Mechanism</button>
          </div>

          <audio id="mercer-audio" preload="auto">
            <source src="media/audio/mercer-tutorial-log.mp3" type="audio/wav">
          </audio>

        </div>
      </div>
    </main>
  `);

  const audio = document.getElementById("mercer-audio");
  const toggleButton = document.getElementById("journal-audio-toggle");
  const statusText = document.getElementById("journal-audio-status");
  const continueButton = document.getElementById("journal-continue");

  if (toggleButton && audio) {
    toggleButton.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => {
          toggleButton.textContent = "Pause Audio";
          statusText.textContent = "Audio Playing";
        }).catch(() => {
          statusText.textContent = "Audio Playback Blocked";
        });
      } else {
        audio.pause();
        toggleButton.textContent = "Play Audio";
        statusText.textContent = "Audio Paused";
      }
    });

    audio.addEventListener("ended", () => {
      toggleButton.textContent = "Play Audio";
      statusText.textContent = "Audio Complete";
    });
  }

if (continueButton) {
  continueButton.addEventListener("click", () => {
    window.location.href = "puzzles/p00/index.html?start=puzzle";
  });
}
}