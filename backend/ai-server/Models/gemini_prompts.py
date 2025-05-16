import google.generativeai as genai
import json
from dotenv import load_dotenv
import os

load_dotenv()

def hitGemini(prompt):
    api_key = os.getenv("API_KEY")
    genai.configure(api_key=api_key)
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)

    start = response.text.find('{')
    end = response.text.rfind('}') + 1

    result = json.loads(response.text[start:end])
    return result