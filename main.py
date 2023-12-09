import openai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)

def reply_with_gpt(messages):
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {openai.api_key}'
        },
        json={
            'model': 'gpt-3.5-turbo',
            'messages': messages
        })

    # Use json parsing
    json_response = response.json()
    return json_response['choices'][0]['message']['content']

@app.route('/get_chat_history', methods=['POST'])
def get_chat_history():
    messages = request.json['messages']
    return jsonify({'history': messages})

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.json['message']
    messages = request.json['messages']
    # messages.append({"role": "user", "content": user_message})
    
    # Get response from GPT
    gpt_response = reply_with_gpt(messages)
    messages.append({"role": "assistant", "content": gpt_response})
    
    return jsonify({'response': gpt_response, 'history': messages})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
