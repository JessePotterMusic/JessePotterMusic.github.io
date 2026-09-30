(() => {
  const prompt = document.querySelector("#mailing-prompt");
  const closeButton = prompt?.querySelector(".mailing-prompt-close");
  const storageKey = "jesse-potter-mailing-prompt-dismissed";
  const twoWeeks = 14 * 24 * 60 * 60 * 1000;

  if (!prompt || !closeButton) return;

  let dismissedAt = 0;
  try {
    dismissedAt = Number(localStorage.getItem(storageKey)) || 0;
  } catch {
    // The invitation still works when browser storage is unavailable.
  }

  if (Date.now() - dismissedAt < twoWeeks) return;

  const showPrompt = () => {
    prompt.hidden = false;
  };

  const dismissPrompt = () => {
    prompt.hidden = true;
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {
      // Dismiss for this page view when browser storage is unavailable.
    }
  };

  const timer = window.setTimeout(showPrompt, 3500);
  closeButton.addEventListener("click", dismissPrompt);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !prompt.hidden) dismissPrompt();
  });
  window.addEventListener("pagehide", () => window.clearTimeout(timer), { once: true });
})();
