function renderSponsorScreen() {
  renderScreen(`
    <main class="app-screen">
      <div class="sponsor-screen" id="sponsor-screen">
        <div class="sponsor-background"></div>

        <div class="sponsor-text">
          <div class="sponsor-line-1">In partnership with</div>
          <div class="sponsor-line-2">The Ritz-Carlton</div>
        </div>
      </div>
    </main>
  `);

  const screen = document.getElementById("sponsor-screen");
  if (!screen) return;

  let hasAdvanced = false;

  function advance() {
    if (hasAdvanced) return;
    hasAdvanced = true;

    transitionTo(() => {
      renderTitleScreen();
    });
  }

  screen.addEventListener("click", advance);

  setTimeout(advance, 4500);
}