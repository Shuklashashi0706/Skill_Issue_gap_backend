import os
import google.generativeai as genai
from flask import Flask

app = Flask(__name__)

def get_skill_gap_assessment():
    # Configure Gemini API 
    genai.configure(api_key='AIzaSyBEvGNVVJJKEJp9lWlBTvFP4TVOZwC50j0')

    # Create the model
    generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
      model_name="gemini-2.0-flash-exp",
      generation_config=generation_config,
    )

    # Start chat session with initial context
    chat_session = model.start_chat(
      history=[
        {
          "role": "user",
          "parts": [
            "skill gap assessment when a person chooses a particular job it asseses his skills and assesses what skills are missing for that job and recommend courses based on that\n",
          ],
        },
        {
          "role": "model",
          "parts": [
            "Okay, let's break down how a skill gap assessment system would work...",
          ],
        },
      ]
    )

    # Send message and get response
    response = chat_session.send_message("skill gap assessment based on the requirements for the job selected")
    
    return response.text

@app.route("/")
def main():
    return "Welcome to Skill Gap Assessment App!"

@app.route('/res')
def hello():
    # Call the function to get Gemini's response
    response_text = get_skill_gap_assessment()
    return response_text

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)