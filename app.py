import os
import openai
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)

messages = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/send_message", methods=["POST"])
def send_message():
    user_input = request.form["user_input"]

    # Add the user's message to the messages list
    messages.append({"role": "user", "content": user_input})

    response = openai.ChatCompletion.create(
        model="gpt-4-0613",
        messages=[
                {"role": "system", "content": """You are assisting with creating HTML snippets tailored to user requests. Remember to provide raw HTML code without any code specifiers or indicators."""},
    
                {"role": "user", "content": """I need a simple HTML snippet with a button labeled 'Click Me!'. Remember, I don't want any code specifiers like triple backticks or language labels. Just the raw HTML."""},
    
                {"role": "assistant", "content": """<button>Click Me!</button>"""},
                
                {"role": "user", "content": """Thank you. I need all of your future messages that contain code to be formatted with just the code within the body of the html, like this."""},
                
                {"role": "assistant", "content": """Understood. I'll only provide the code without any specifiers, So that my entire response will be functional and executable directly within the browser."""},
                
            *messages
        ],
        n=1,
        temperature=0.0,
        frequency_penalty=0,
        presence_penalty=0,
    )

    assistant_response = response['choices'][0]['message']['content']

    # Add the assistant's message to the messages list
    messages.append({"role": "assistant", "content": assistant_response})

    return jsonify({"assistant_response": assistant_response})

if __name__ == "__main__":
    app.run(debug=True)