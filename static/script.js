document.addEventListener('DOMContentLoaded', function() {
    const chatHistory = document.getElementById('chat-history');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');

    let messages = [];

    // Function to update the chat history on the page
    function updateChatHistory() {
        chatHistory.innerHTML = '';
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = message.role === 'user' ? 'user-message message' : 'assistant-message message';
            messageDiv.textContent = message.content;
            chatHistory.appendChild(messageDiv);
        });
        // Scroll to the bottom of the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function sendMessageToServer() {
        const userMessage = userMessageInput.value.trim();

        if (userMessage !== '') {
            // Add user's message to the local messages array
            messages.push({ role: 'user', content: userMessage });
            updateChatHistory();

            // Send user's message to the server
            fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    messages: messages,
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Update local messages with server's response
                messages = data.history;
                console.log(messages);
                updateChatHistory();
            });

            // Clear the input field
            userMessageInput.value = '';
        }
    }

    sendButton.addEventListener('click', function(event) {
        event.preventDefault();
        sendMessageToServer();
    });

    // Deal with Chinese input
    let composing = false;   // trace composition
    userMessageInput.addEventListener('compositionstart', function(event) {
        composing = true;
    });

    userMessageInput.addEventListener('compositionend', function(event) {
        composing = false;
    });

    userMessageInput.addEventListener('keydown', function(event) {
        if (!composing && event.key === 'Enter') {
            event.preventDefault();
            sendMessageToServer();
        }
    });



    // Initial call to get the chat history from the server
    fetch('/get_chat_history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Update local messages with server's response
        messages = data.history;
        updateChatHistory();
    });
});
