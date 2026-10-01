const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const originalButtonHTML = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.innerHTML = "Sending…";

  status.hidden = true;
  status.className = "form-status";

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

      form.hidden = true;

      status.innerHTML = `
        <div class="form-success">
          <span class="form-success-mark" aria-hidden="true">✓</span>
          <h2>Message sent.</h2>
          <p>
            Thanks for getting in touch. I'll get back to you as soon as I can.
          </p>
          <button type="button" class="form-again" id="send-another">
            Send another message
          </button>
        </div>
      `;

      status.hidden = false;

      document
        .querySelector("#send-another")
        .addEventListener("click", () => {
          status.hidden = true;
          form.hidden = false;

          const firstField = form.querySelector("input");
          firstField.focus();
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
        // Use the default message.
      }

      status.innerHTML = `
        <div class="form-error">
          <strong>Message not sent.</strong>
          <p>${message}</p>
        </div>
      `;

      status.hidden = false;
      status.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
      });
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
