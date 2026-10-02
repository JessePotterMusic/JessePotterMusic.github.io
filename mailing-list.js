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
    dismissedAt = Date.now();
    try {
      localStorage.setItem(storageKey, String(dismissedAt));
    } catch {
      // Dismiss for this page view when browser storage is unavailable.
    }
  };

  let timer = window.setTimeout(showPrompt, 3500);
  closeButton.addEventListener("click", dismissPrompt);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !prompt.hidden) dismissPrompt();
  });
  window.addEventListener("pagehide", () => window.clearTimeout(timer));
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try {
      dismissedAt = Number(localStorage.getItem(storageKey)) || dismissedAt;
    } catch {
      // Preserve this page's dismissal when storage is unavailable.
    }
    if (Date.now() - dismissedAt < twoWeeks) {
      prompt.hidden = true;
    } else if (prompt.hidden) {
      timer = window.setTimeout(showPrompt, 3500);
    }
  });
})();
