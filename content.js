document.addEventListener("mouseup", (event) => {
  const selectedText = window.getSelection().toString().trim();

  // Prevent container from being recreated if clicking inside the container
  if (event.target.closest("#chatgpt-action-container")) {
    return;
  }

  // Remove existing container if it exists
  let existingContainer = document.getElementById("chatgpt-action-container");
  if (existingContainer) {
    existingContainer.remove();
  }

  if (selectedText) {
    console.log("Selected text:", selectedText);

    // Create a container div
    const container = document.createElement("div");
    container.id = "chatgpt-action-container";
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    container.style.backgroundColor = "#fff";
    container.style.border = "1px solid #ccc";
    container.style.padding = "3px";
    container.style.borderRadius = "4px";
    container.style.top = `${event.clientY + 5}px`;
    container.style.left = `${event.clientX + 5}px`;
    container.style.display = "flex";
    container.style.flexDirection = "column"; 
    container.style.gap = "8px";

    // Load settings and create buttons
    chrome.storage.sync.get(["userSettings"], (data) => {
      const settings = data.userSettings || {
        showGPT: true,
        showGoogle: true,
        showTwitter: true,
        customButtons: []
      };

      if (settings.showGPT) {
        createCustomButton(container, "Ask GPT", "#0d60fd", `https://chat.openai.com/?q=${encodeURIComponent(selectedText)}`);
      }
      if (settings.showGoogle) {
        createCustomButton(container, "Google", "#db4437", `https://www.google.com.hk/search?q=${encodeURIComponent(selectedText)}`);
      }
      if (settings.showTwitter) {
        createCustomButton(container, "Twitter(X)", "#1da1f2", `https://x.com/search?q=${encodeURIComponent(selectedText)}&src=typed_query`);
      }

      // Add custom buttons
      settings.customButtons.forEach((button) => {
        createCustomButton(container, button.name, button.color, button.url.replace("{query}", encodeURIComponent(selectedText)));
      });
    });

    document.body.appendChild(container);

    // Auto-remove the container after 2.5 seconds
    setTimeout(() => {
      if (container) {
        container.remove();
      }
    }, 3000);
  }
});

function createCustomButton(container, buttonText, buttonColor, url) {
  const button = document.createElement("button");
  button.textContent = buttonText;
  button.style.backgroundColor = buttonColor;
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.padding = "5px 10px";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";

  button.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the event from triggering the text selection event again
    window.open(url, "_blank");
    container.remove(); // Remove the container after clicking
  });

  container.appendChild(button);
}
