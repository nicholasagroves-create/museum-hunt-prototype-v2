function renderBriefingScreen() {
  renderScreen(`
    <main class="app-screen briefing-screen">
      <div class="briefing-artifact">
        <div class="briefing-overlay">

          <div class="briefing-title">
            RECOVERED MISSION BRIEFING
          </div>

          <div class="briefing-letter">
            <div class="briefing-letterhead">
              <div class="briefing-org">RALEIGH MUSEUM OF NATURAL SCIENCES</div>
              <div>11 West Jones Street</div>
              <div>Raleigh, NC 27601</div>
              <div>United States</div>
            </div>

            <div class="briefing-department">
              Office of Special Collections &amp; Restricted Archives
            </div>

            <div class="briefing-meta-block">
              <div><span class="briefing-meta-label">Date:</span> October 12, 2026</div>
              <div><span class="briefing-meta-label">To:</span> Authorized Research Participant</div>
              <div><span class="briefing-meta-label">Re:</span> Recovered Mission Briefing — Mercer Expedition</div>
            </div>

            <div class="briefing-paragraph">
              The Mercer Expedition was granted limited access to restricted archive areas following repeated claims of undocumented mechanical systems embedded within the museum.
            </div>

            <div class="briefing-paragraph">
              Contact with the team was lost three days ago.
            </div>

            <div class="briefing-paragraph">
              Preliminary review of recovered data indicates the presence of a structured sequence of mechanisms, each requiring environmental interpretation to operate. These systems appear to regulate access to fragmented expedition records.
            </div>

            <div class="briefing-paragraph">
              At present, the museum has recovered a single partial audio log attributed to Mercer’s team.
            </div>

            <div class="briefing-paragraph">
              You have been granted provisional access to continue the recovery process.
            </div>

            <div class="briefing-emphasis-line">
              Your role is not exploration. It is recovery.
            </div>

            <div class="briefing-paragraph">
              Follow the Mercer team’s path. Restore their logs. Determine what they encountered—and why they did not return.
            </div>

            <div class="briefing-paragraph">
              The museum expects discretion.
            </div>

            <div class="briefing-closing">
              And results.
            </div>

            <div class="briefing-signature">
              <div>Dr. Evelyn Carter</div>
              <div>Director, Special Collections &amp; Restricted Archives</div>
              <div>Raleigh Museum of Natural Sciences</div>
            </div>
          </div>

          <div class="briefing-audio-card">
            <div class="briefing-audio-kicker">Attached Material</div>
            <div class="briefing-audio-title">Partially Recovered Audio Log</div>
            <div class="briefing-audio-meta">SOURCE: MERCER EXPEDITION • STATUS: UNVERIFIED</div>
            <button id="open-audio-log" class="briefing-audio-button">
              ACCESS RECOVERED AUDIO
            </button>
          </div>

        </div>
      </div>
    </main>
  `);

const openAudioButton = document.getElementById("open-audio-log");

if (openAudioButton) {
  openAudioButton.addEventListener("click", () => {
    transitionTo(renderMercerAudioJournalScreen, { hardCut: true });
  });
}
}