// Copyright, 2024, Smark

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "textSelected") {
      console.log("--------------");
      
      const userConfirmed = confirm(`Send the following text to ChatGPT?\n\n"${message.text}"`);
      if (userConfirmed) {
        chrome.storage.local.set({ selectedText: message.text }, () => {
          chrome.action.openPopup();
        });
      }
    }
  });
  