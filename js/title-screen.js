function renderTitleScreen() {
  appRoot.innerHTML = `
    <main class="app-screen">
      <div class="title-black-screen" id="title-black-screen"></div>
    </main>
  `;

  const audio = document.getElementById("title-audio");
  let hasAdvanced = false;
  let titleIsVisible = false;

  function advance() {
    if (hasAdvanced || !titleIsVisible) return;
    hasAdvanced = true;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    transitionTo(renderBriefingScreen);
  }

  if (audio) {
    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.play().catch(() => {});
  }

  setTimeout(() => {
    appRoot.innerHTML = `
      <main class="app-screen">
        <div class="title-screen" id="title-screen"></div>
      </main>
    `;

    titleIsVisible = true;

    const titleScreen = document.getElementById("title-screen");
    if (titleScreen) {
      titleScreen.addEventListener("click", advance);
    }

    setTimeout(() => {
      if (!titleScreen) return;

      const beginMessage = document.createElement("div");
      beginMessage.className = "title-begin-message";
      beginMessage.textContent = "CLICK TO BEGIN";
      titleScreen.appendChild(beginMessage);
    }, 3000);
  }, 3500);
}