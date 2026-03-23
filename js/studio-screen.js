function renderStudioScreen() {
  const studioAudio = document.getElementById("studio-bulb-audio");

  renderScreen(`
    <main class="app-screen">
      <div class="studio-screen" id="studio-screen">
        <div class="studio-background" id="studio-background"></div>
        <div class="studio-darkness" id="studio-darkness"></div>
        <div class="studio-gradient"></div>

        <div class="studio-text" id="studio-text">
          <div class="studio-title">SPORCLE EXPERIENCES</div>
          <div class="studio-subtitle">presents</div>
        </div>
      </div>
    </main>
  `);

  const screen = document.getElementById("studio-screen");
  const background = document.getElementById("studio-background");
  const darkness = document.getElementById("studio-darkness");
  const text = document.getElementById("studio-text");

  if (!screen || !background || !darkness || !text || !studioAudio) return;

  studioAudio.pause();
  studioAudio.currentTime = 0;
  studioAudio.volume = 0.45;

  let hasAdvanced = false;

  function advance() {
    if (hasAdvanced) return;
    hasAdvanced = true;

    studioAudio.pause();
    studioAudio.currentTime = 0;

    transitionTo(renderSponsorScreen);
  }

  background.classList.add("is-visible");

  setTimeout(() => {
    studioAudio.play().catch(() => {});
  }, 150);

  setTimeout(() => {
    darkness.style.opacity = "0.78";
  }, 1420);

  setTimeout(() => {
    darkness.style.opacity = "0.58";
  }, 1690);

  setTimeout(() => {
    darkness.style.opacity = "0.72";
  }, 1810);

  setTimeout(() => {
    darkness.style.opacity = "0.35";
  }, 2250);

  setTimeout(() => {
    darkness.style.opacity = "0.10";
  }, 2540);

  setTimeout(() => {
    darkness.style.opacity = "0.16";
  }, 3320);

// light stabilizes
setTimeout(() => {
  darkness.style.opacity = "0.08";
}, 3600);

// BREATH 1 (2.5 seconds)
setTimeout(() => {
  text.classList.add("is-visible");
}, 6100);

  screen.addEventListener("click", advance);

  setTimeout(advance, 10000);
}