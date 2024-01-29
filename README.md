# AI Restaurant Assistant
AI Restaurant Assistant "胖胖" assists restaurants in managing customer reservations, takeout, and in-house ordering processes. Feel free to interact with "Pang Pang" and experience the functionalities as if you were a customer!

## Installation:

1. Install the required packages from `requirements.txt`:

    ```bash
    pip3 install -t lib -r requirements.txt
    ```

2. Add your own OpenAI API key to the `.env` file.

3. Run the application using Python 3:

    ```bash
    python3 main.py
    ```

4. Go to the webpage [http://127.0.0.1:5000](http://127.0.0.1:5000) and start your conversation.

## Customizing GPT Prompts

The design for GPT prompts can be customized in the `static/script.js` file. Specifically, you can find the relevant configuration in the `rolePrompt` variable.

Feel free to experiment and adjust the GPT prompt to suit the needs of your project.

