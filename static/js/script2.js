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
      <div class="chat-button" >
        <div class="active-pro" id="new-chat">New Chat</div>
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
        <lable class="name"> Document used </lable>
      </div>
      <div class="document-section">
        <div class="active-pro" id="documents">
        <div id="document-text"> LAW BOOK </div>
        <div id="download-button"><img width="20" height="20" src="https://img.icons8.com/material-rounded/24/FFFFFF/download--v1.png" alt="download--v1"/></div>
        </div>
        <div class="active-pro" id="documents">
        <div id="document-text"> LAW BOOK </div>
        <div id="download-button"><img width="20" height="20" src="https://img.icons8.com/material-rounded/24/FFFFFF/download--v1.png" alt="download--v1"/></div>
        </div>
        <div class="active-pro" id="documents">
        <div id="document-text"> LAW BOOK </div>
        <div id="download-button"><img width="20" height="20" src="https://img.icons8.com/material-rounded/24/FFFFFF/download--v1.png" alt="download--v1"/></div>
        </div>
        <div class="active-pro" id="documents">
        <div id="document-text"> LAW BOOK </div>
        <div id="download-button">
  <a href="{{ url_for('static',filename='data/Law.pdf') }}" download="Law document.pdf">
    <img width="20" height="20" src="https://img.icons8.com/material-rounded/24/FFFFFF/download--v1.png" alt="download--v1"/>
  </a>
</div>

        </div>
      </div>
    </div>`,
    `<div id="locked">
    <img width="26" height="26" src="https://img.icons8.com/metro/26/unlock.png" alt="unlock"/>
    <p>Unlock with pro</p>`,
    `
      <div id='register'>
      <input type="text" placeholder="Name" name="username"/><br/>
      <input type="password" placeholder="Password" name="passwd"/><br/>
      <div class='active-pro' id='submit'>Sign Up</div>
      <p>-----------------or-----------------</p>
      <div class='active-pro' id='submit'>Login</div>
      <p>Frogot passward? click here to reset </p>
      </div>
      
    `,
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

  function newChat() {
    // Reset display
    display.innerHTML = "";

    // Reset history tab
    const historyTab = document.getElementById("history");
    historyTab.innerHTML = "No chat yet";
    flag = true;
  }

  // Add event listener to new chat button
  document.getElementById("new-chat").addEventListener("click", newChat);

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
