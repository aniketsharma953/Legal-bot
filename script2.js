function sendMessage() {
    var userInput = document.getElementById("input-text").value;
    displayMessage("User", userInput);

    // Simulate a response from the legal chatbot
    var botResponse = "This is a placeholder response from the legal chatbot.";
    displayMessage("Chatbot", botResponse);

    // Clear the input field after sending the message
    document.getElementById("input-text").value = "";
}

function displayMessage(sender, message) {
    var chatMessages = document.getElementById("chat-messages");
    var newMessage = document.createElement("div");
    newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(newMessage);

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
