const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const formNote = document.querySelector(".form-note");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const originalButtonHTML = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.innerHTML = "Sending…";

  status.hidden = true;
  status.innerHTML = "";

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      form.reset();

      /* Hide the form directly */
      form.style.setProperty("display", "none", "important");

      /* Hide the little note underneath it too */
      if (formNote) {
        formNote.style.display = "none";
      }

      status.innerHTML = `
        <div class="form-success">
          <span class="form-success-mark" aria-hidden="true">✓</span>

          <h2>Message sent.</h2>

          <p>
            Thanks for getting in touch. I'll get back to you as soon as I can.
          </p>

          <button
            type="button"
            class="form-again"
            id="send-another"
          >
            Send another message
          </button>
        </div>
      `;

      status.hidden = false;

      /* Bring the confirmation into view */
      requestAnimationFrame(() => {
        status.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          block: "center"
        });
      });

      document
        .querySelector("#send-another")
        .addEventListener("click", () => {
          status.hidden = true;
          status.innerHTML = "";

          /* Restore the form */
          form.style.removeProperty("display");

          if (formNote) {
            formNote.style.removeProperty("display");
          }

          const firstField = form.querySelector("input");

          if (firstField) {
            firstField.focus();
          }
        });

    } else {
      let message =
        "Something went wrong while sending your message. Please try again.";

      try {
        const data = await response.json();

        if (data.errors && data.errors.length) {
          message = data.errors
            .map((error) => error.message)
            .join(" ");
        }
      } catch {
        // Keep the default error message.
      }

      status.innerHTML = `
        <div class="form-error">
          <strong>Message not sent.</strong>
          <p></p>
        </div>
      `;

      status.querySelector(".form-error p").textContent = message;
      status.hidden = false;
    }

  } catch (error) {
    status.innerHTML = `
      <div class="form-error">
        <strong>Couldn't connect.</strong>

        <p>
          Please check your connection and try sending the message again.
        </p>
      </div>
    `;

    status.hidden = false;

  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonHTML;
  }
});
