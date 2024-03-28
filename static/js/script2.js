document.addEventListener("DOMContentLoaded", async function () {
  const inputMessage = document.getElementById("inputMessage");
  const sendButton = document.getElementById("send");
  const display = document.getElementById("display");

  async function printMessage() {
    const message = inputMessage.value.trim();
    if (message !== "") {
      const userInputElement = document.createElement("div");
      userInputElement.classList.add("user-message");
      userInputElement.innerHTML = `<strong>You:</strong> ${message}`;
      display.appendChild(userInputElement);
      inputMessage.value = "";
      const output = await simulateOutput(message);
      const botOutputElement = document.createElement("div");
      botOutputElement.classList.add("bot-message");
      botOutputElement.innerHTML = `<strong>ChatBot:</strong> ${output}`;
      display.appendChild(botOutputElement);
      display.scrollTop = display.scrollHeight;
    }
  }

  async function sendMessage(message) {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `msg=${encodeURIComponent(message)}`,
    });
    return await response.json();
  }
  //ethe tere hii kamm aa
  async function simulateOutput(input) {
    const botResponse = await sendMessage(input);
    return botResponse.content;
  }
  sendButton.addEventListener("click", printMessage);
  inputMessage.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      printMessage();
    }
  });
});

// const chatBox = document.getElementById("chat-box");
// const chatForm = document.getElementById("chat-form");
// const userInput = document.getElementById("user-input");

// Function to send user message to Flask backend
// async function sendMessage(message) {
//   const response = await fetch("/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: `msg=${encodeURIComponent(message)}`,
//   });
//   return await response.json();
// }

// // Function to append message to chat box
// function appendMessage(role, content) {
//   const message = document.createElement("div");
//   message.classList.add(role);
//   message.textContent = content;
//   chatBox.appendChild(message);
//   chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
// }

// // Event listener for form submission
// chatForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   const userMessage = userInput.value.trim();
//   if (userMessage !== "") {
//     appendMessage("user", userMessage);
//     userInput.value = "";
//     const botResponse = await sendMessage(userMessage);
//     appendMessage("bot", botResponse.content);
//   }
// });
