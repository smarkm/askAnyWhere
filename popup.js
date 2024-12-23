// Copyright, 2024, Smark

const API_KEY = 'YOUR_OPENAI_API_KEY';

chrome.storage.local.get("selectedText", ({ selectedText }) => {
  if (selectedText) {
    getChatGPTResponse(selectedText);
  } else {
    document.getElementById("response").innerText = "No text selected.";
  }
});

async function getChatGPTResponse(text) {
  try {
    const responseElement = document.getElementById("response");
    responseElement.innerText = "Waiting for ChatGPT response...";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    const chatGPTResponse = data.choices[0].message.content;

    responseElement.innerText = chatGPTResponse;
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    document.getElementById("response").innerText = "Error fetching response.";
  }
}
