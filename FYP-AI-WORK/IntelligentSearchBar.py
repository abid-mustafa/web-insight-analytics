import Schema as inputSchema
import google.generativeai as genai
import json
from dotenv import load_dotenv
import os
load_dotenv()
def processingInput(inputPrompt, website_id):
    prompt = (
    f"Input: {inputPrompt}\n\n"
    f"### Instruction:\n"
    f"Analyze the input and classify it into one of the following categories:\n"
    f"- General Analytical Question: If the input is related to web analytics, data tracking, or analytical tools, provide a concise answer.\n"
    f"- SQL Query Required: If the input explicitly requires retrieving data from a database, generate a valid *MySQL SELECT query* based on the schema and website_id.\n"
    f"- Query Rejected (Modification Attempt): If the input requests DELETE, INSERT, UPDATE, DROP, or ALTER, reject it.\n"
    f"- Out of Scope: If the input is unrelated to analytics, return a JSON response indicating it is out of domain.\n\n"

    f"### Schema Reference (Strict Adherence Required):\n{inputSchema}\n\n"
    f"### Website Context (Restrict to this website only):\nWebsite ID: {website_id}\n\n"

    f"### Forbidden SQL Queries (Strict Rejection):\n"
    f"- Do NOT generate DELETE, INSERT, UPDATE, DROP, or ALTER queries.\n"
    f"- If the user requests such a query, return: "
    f"{{'prompt_type': 'query_rejected', 'answer': 'SQL modification queries are not allowed.'}}\n\n"

    f"### Safe SQL Query Guidelines:\n"
    f"- *Only generate SELECT queries* that retrieve data.\n"
    f"- Use correct JOINs based on foreign key relationships in the schema.\n"
    f"- Use DATE() when comparing or grouping by timestamp fields (e.g., session_start). \n"
    f"- For bounce rate calculation: \n"
    f"    - Use a subquery or CTE to count how many page views occurred in each session.\n"
    f"    - Define bounce as a session with only one page view.\n"
    f"    - Do *not* use COUNT() inside CASE WHEN directly (invalid syntax).\n"
    f"- Always filter results using: WHERE s.website_id = {website_id}.\n\n"
    f"- Always sort data in descending order where you can\n\n"
    f"- Always limit to 10 rows of data\n\n"
    f"### Expected Output Format (Strict JSON, Single-Line SQL Query):\n"
    
    f"Return a JSON object containing:\n"
    f"- 'prompt_type': One of ['general_question', 'query', 'out_of_domain', 'query_rejected']\n"
    f"- 'answer': Either a concise explanation or a **single-line MySQL SELECT query with no \\n or unnecessary spaces.\n\n"

    f"### Example Responses:\n"
    f"*Rejected DELETE Query (Strictly Blocked)*\n"
    f"   Input: 'Delete the bounce rate where bounce rate is less than 35'\n"
    f"   Output: {{'prompt_type': 'query_rejected', 'answer': 'SQL modification queries are not allowed.'}}\n\n"

    f"*Valid SQL Query (Bounce Rate by Page Title)*\n"
    f"   Input: 'Give me overall bounce rate by page title'\n"
    f"   Output: {{'prompt_type': 'query', 'answer': 'WITH session_counts AS (SELECT session_id, COUNT(*) AS session_page_count FROM page_views GROUP BY session_id) SELECT pv.page_title, COUNT(DISTINCT s.id) AS total_sessions, COUNT(DISTINCT CASE WHEN sc.session_page_count = 1 THEN s.id END) AS bounced_sessions, ROUND((COUNT(DISTINCT CASE WHEN sc.session_page_count = 1 THEN s.id END) / COUNT(DISTINCT s.id)) * 100, 2) AS bounce_rate FROM page_views pv JOIN sessions s ON pv.session_id = s.id JOIN session_counts sc ON s.id = sc.session_id WHERE s.website_id = {website_id} GROUP BY pv.page_title ORDER BY bounce_rate DESC;'}}\n\n"

    f"### Output Constraints:\n"
    f"- Ensure the response is in pure JSON format without any additional text, comments, or explanations."
)
    
    api_key = os.getenv('API_KEY')
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    print(response.text)

    startIndex=response.text.find("{")
    endIndex=response.text.rfind("}")+1

    result = json.loads(response.text[startIndex:endIndex])
    return result