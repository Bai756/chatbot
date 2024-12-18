from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.secret_key = os.getenv('SECRET_KEY')

# API
API_URL = "https://jamsapi.hackclub.dev/openai/chat/completions"
API_KEY = os.getenv('API_KEY')

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def get_response(question):
    payload = {
        "model": "gpt-3.5-turbo", 
        "messages": [
            {"role": "user", "content": question}
        ],
        "max_tokens": 100,  
        "temperature": 0.7
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        answer = response.json()["choices"][0]["message"]["content"]
    else:
        answer = "I'm sorry, I don't understand."

    return answer

@app.route('/')
def index():
    if 'messages' not in session:
        session['messages'] = [{'type': 'bot', 'text': 'Hello, I am a chatbot! Ask me anything.'}]
    
    return render_template('index.html', messages=session['messages'])


@app.route('/clear')
def clear():
    session.clear()
    return redirect(url_for('index'))


@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.form.get('question', '')
    
    session['messages'].append({'type': 'user', 'text': user_message})

    answer = get_response(user_message)
    session['messages'].append({'type': 'bot', 'text': answer})
    session.modified = True

    return jsonify({"response": answer})
