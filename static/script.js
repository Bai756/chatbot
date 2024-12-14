
document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('#chat-form');
    const chatbox = document.getElementById('chatbox');
    let loadingMessage;

    chatbox.scrollTop = chatbox.scrollHeight;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const userMessage = form.question.value.trim();
        form.question.value = '';

        if (userMessage) {
            const userMessageDiv = createMessageElement('user', userMessage);
            chatbox.appendChild(userMessageDiv);

            if (loadingMessage) loadingMessage.remove();
            loadingMessage = createLoadingMessage();
            chatbox.appendChild(loadingMessage);

            chatbox.scrollTop = chatbox.scrollHeight;

            const formData = new FormData();
            formData.append('question', userMessage);

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                const answer = data.response;

                if (loadingMessage) loadingMessage.remove();

                const answerDiv = createMessageElement('bot', answer);
                chatbox.appendChild(answerDiv);

                chatbox.scrollTop = chatbox.scrollHeight;

            } catch (error) {
                console.error('Error:', error);

                const errorDiv = document.createElement('div');
                errorDiv.className = 'message bot';
                errorDiv.innerHTML = `<p>An error occurred.</p>`;
                chatbox.appendChild(errorDiv);
                chatbox.scrollTop = chatbox.scrollHeight;
            }
        }
    });

    function createMessageElement(type, text) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', `${type}-container`);

        const profileBubble = document.createElement('div');
        profileBubble.classList.add('profile-bubble', `${type}-bubble`);

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        messageDiv.appendChild(messageText);

        if (type === 'bot') {
            messageContainer.append(profileBubble, messageDiv);
        }
        else {
            messageContainer.append(messageDiv, profileBubble);
        }

        return messageContainer;
    }

    function createLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.classList.add('message-container', 'bot-container');

        const profileBubble = document.createElement('div');
        profileBubble.classList.add('profile-bubble', 'bot-bubble');

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot');
        
        messageDiv.innerHTML = `<p><span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></p>`;
        
        loadingDiv.append(profileBubble, messageDiv);

        return loadingDiv;
    }
});