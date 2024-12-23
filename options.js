document.addEventListener("DOMContentLoaded", () => {
    const showGPT = document.getElementById("showGPT");
    const showGoogle = document.getElementById("showGoogle");
    const showTwitter = document.getElementById("showTwitter");
    const customButtonsContainer = document.getElementById("custom-buttons");
    const addButton = document.getElementById("add-button");
    const saveButton = document.getElementById("save");
  
    // Load existing settings
    chrome.storage.sync.get(["userSettings"], (data) => {
      if (data.userSettings) {
        showGPT.checked = data.userSettings.showGPT;
        showGoogle.checked = data.userSettings.showGoogle;
        showTwitter.checked = data.userSettings.showTwitter;
  
        // Load custom buttons
        data.userSettings.customButtons.forEach(addCustomButton);
      }
    });
  
    addButton.addEventListener("click", () => {
      addCustomButton();
    });
  
    saveButton.addEventListener("click", () => {
      const customButtons = Array.from(document.querySelectorAll(".custom-button")).map((div) => ({
        name: div.querySelector(".button-name").value,
        color: div.querySelector(".button-color").value,
        url: div.querySelector(".button-url").value
      }));
  
      chrome.storage.sync.set({
        userSettings: {
          showGPT: showGPT.checked,
          showGoogle: showGoogle.checked,
          showTwitter: showTwitter.checked,
          customButtons
        }
      }, () => {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              chrome.tabs.sendMessage(tab.id, { action: "reloadSettings" });
            });
          });
          
        alert("Settings saved!");
      });
    });
  
    function addCustomButton(button = { name: "", color: "#5de0ea", url: "" }) {
      const div = document.createElement("div");
      div.classList.add("custom-button");
      div.innerHTML = `
        <input type="text" class="button-name" placeholder="Action Name" value="${button.name}">
        <input type="color" class="button-color" value="${button.color}">
        <input type="text" class="button-url" placeholder="URL (use {query} for selection)" value="${button.url}">
        <button class="remove-button">Remove</button>
      `;
      div.querySelector(".remove-button").addEventListener("click", () => div.remove());
      customButtonsContainer.appendChild(div);
    }
  });
  