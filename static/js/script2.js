document.addEventListener("DOMContentLoaded", async function () {
  const inputMessage = document.getElementById("inputMessage");
  const sendButton = document.querySelector(".send");
  const display = document.getElementById("display");
  let sendingMessage = false;

  async function printMessage() {
    if (!sendingMessage) {
      const message = inputMessage.value.trim();
      if (message !== "") {
        sendingMessage = true;
        sendButton.removeAttribute("id");
        sendButton.textContent = "";
        sendButton.classList.add("loader");

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
        sendingMessage = false;
        sendButton.classList.remove("loader");
        sendButton.textContent = "Send";
        sendButton.setAttribute("id", "send");
      }
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

  var chatOption = document.getElementById("chat");
  var middleDiv = document.getElementById("middle");

  chatOption.addEventListener("click", function () {
    middleDiv.classList.toggle("hidden");
  });
});
