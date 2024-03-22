document.addEventListener('DOMContentLoaded', function() {
    const inputMessage = document.getElementById('inputMessage');
    const sendButton = document.getElementById('send');
    const display = document.getElementById('display');

    function sendMessage() {
        const message = inputMessage.value.trim();
        if (message !== '') {
            const userInputElement = document.createElement('div');
            userInputElement.classList.add('user-message');
            userInputElement.innerHTML = `<strong>You:</strong> ${message}`;
            display.appendChild(userInputElement);
            inputMessage.value = '';
            const output = simulateOutput(message);
            const botOutputElement = document.createElement('div');
            botOutputElement.classList.add('bot-message');
            botOutputElement.innerHTML = `<strong>ChatBot:</strong> ${output}`;
            display.appendChild(botOutputElement);
            display.scrollTop = display.scrollHeight;
        }
    }
    //ethe tere hii kamm aa
    function simulateOutput(input) {
        return "This is a response to: " + input;
    }
    sendButton.addEventListener('click', sendMessage);
    inputMessage.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
