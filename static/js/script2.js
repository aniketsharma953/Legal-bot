document.addEventListener("DOMContentLoaded", async function () {
  const inputMessage = document.getElementById("inputMessage");
  const sendButton = document.querySelector(".send");
  const display = document.getElementById("display");
  let sendingMessage = false;
  const middleDiv = document.getElementById("middle");
  const options = document.querySelectorAll(".option");
  const optionsImages = document.querySelectorAll(".option-img");
  const tabs = document.getElementById("tabs");
  let flag = true;

  const alterImages = [
    "https://img.icons8.com/ios-filled/50/speech-bubble-with-dots.png",
    "https://img.icons8.com/ios-filled/50/google-docs.png",
    "https://img.icons8.com/ios-filled/50/cloud.png",
    "https://img.icons8.com/fluency-systems-filled/48/user.png",
  ];

  const imageSrc = Array.from(optionsImages).map((element) => {
    // Corrected method
    return element.src;
  });

  const middle = [
    `<div class="chat">
      <div class="lable_chat">
        <lable class="name"> Chat </lable>
      </div>
      <div class="chat-button" onclick="newChat()">
        <div class="active-pro">New Chat</div>
      </div>
    </div>
    <div class="chat">
      <div class="lable_chat">
        <lable class="name"> History </lable>
      </div>
      <div class="chat-button">
        <div class=" active-pro" id="history">No chat yet</div>
      </div>
    </div>`,
    `<div class="chat">
      <div class="lable_chat">
        <lable class="name"> cloud Chat </lable>
      </div>
      <div class="chat-button">
        <div class="active-pro">New Chat</div>
      </div>
    </div>`,
    `<div class="chat">
      <div class="lable_chat">
        <lable class="name"> paper Chat </lable>
      </div>
      <div class="chat-button">
        <div class="active-pro">New Chat</div>
      </div>
    </div>`,
  ];

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

        const historyTab = document.getElementById("history");
        const questionDiv = document.createElement("div");
        const questionImage = document.createElement("img");
        questionImage.src =
          "https://img.icons8.com/ios-filled/50/speech-bubble-with-dots.png";

        questionDiv.setAttribute("class", "question-div");
        questionDiv.appendChild(questionImage); // Append the image to the questionDiv
        questionDiv.appendChild(document.createTextNode(message));

        if (flag) {
          historyTab.innerHTML = "";
          flag = false;
        }

        historyTab.appendChild(questionDiv);
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

  optionsImages[0].src = alterImages[0];
  options[0].classList.add("active");
  tabs.innerHTML = middle[0];

  options.forEach((element, index) => {
    element.addEventListener("click", function () {
      optionsImages.forEach((img, i) => {
        img.src = imageSrc[i];
      });

      options.forEach((option) => {
        option.classList.remove("active");
      });

      optionsImages[index].src = alterImages[index];
      element.classList.add("active");
      tabs.innerHTML = middle[index];
    });
  });
});
