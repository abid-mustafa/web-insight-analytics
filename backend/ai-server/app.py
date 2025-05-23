from flask import Flask,jsonify,request,render_template
from flask_cors import CORS
import intelligent_search_bar as IS
from Models.Kaplien_Meier.KM_excecution import ExcecuteKM
from Models.Prophet.prophet_execution import ExecuteProphet
from Models.KMeans.KMeans_execution import ExcecuteKMeans
from Models.TPS.TPS_excecution import ExecuteTPS
from dotenv import load_dotenv
from datetime import datetime
import os
import requests
import json
from email.message import EmailMessage
from email.utils import formatdate
import smtplib

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
sender_email = os.getenv("SENDER_MAIL")
sender_password = os.getenv("SENDER_APP_PASS")
company_name = os.getenv("COMPANY_NAME")
external_pdf_api = os.getenv("API_GENERATION_SERVICE")

@app.route('/api/search-bar',methods=['POST'])
def IntelligentSearchBar():
    data=request.get_json()
    if 'text' not in data or 'websiteId' not in data:
        return jsonify({'message': 'Text or websiteId Missing'}),400
    inputPrompt = data['text']
    website_id = data['websiteId']
    generalOutput = IS.processingInput(inputPrompt, website_id)
    if generalOutput:
        return jsonify({'message':'successfull','result':generalOutput}),200
    return jsonify({'message':'server error'}),500

@app.route('/api/report', methods=['POST'])
def AIDrivenReport():
    data = request.get_json()
    print(data)
    if not data.get('start') or not data.get('end') or not data.get('websiteId') or not data.get('email'):
        return jsonify({'message': 'Parameters Missing'}),400
    
    start_date = data["start"]
    end_date = data["end"]
    website_id = data["websiteId"]
    receiver_email = data['email']
    Kaplen_Report = ExcecuteKM(website_id,start_date,end_date)
    Prophet_Report = ExecuteProphet(website_id,start_date,end_date)
    KMeans_Report = ExcecuteKMeans(website_id,start_date,end_date)
    TPS_Report = ExecuteTPS(website_id,start_date,end_date)
    if Kaplen_Report and Prophet_Report and KMeans_Report and TPS_Report:
        final_json = {
            "Kaplen": Kaplen_Report,
            "Prophet": Prophet_Report,
            "KMeans": KMeans_Report,
            "TPS": TPS_Report
        }
        current_date = datetime.now()
        formatted_date = current_date.strftime("%B %d, %Y").replace(" 0", " ")
        rendered_html = render_template("template.html", data=final_json, generated_on=formatted_date)
        payload = json.dumps({
            "html": rendered_html
        })
        pdf_response = requests.post(
            external_pdf_api,
            data=payload,
            headers={
            "Content-Type": "application/json"
            }
        )
        if pdf_response.status_code == 200:
            pdf_data = pdf_response.content
            print("PDF data received successfully")
            
            # Create professional email with the PDF attachment
            # Create message container
            msg = EmailMessage()
            msg['Subject'] = "Your Requested PDF Report"
            msg['From'] = f"{company_name} <{sender_email}>"
            msg['To'] = receiver_email
            msg['Date'] = formatdate(localtime=True)
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Requested PDF Report</title>
                <style>
                    body {{
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                    }}
                    .email-container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        padding: 20px 0;
                        border-bottom: 2px solid #f0f0f0;
                    }}
                    .logo {{
                        font-size: 22px;
                        font-weight: bold;
                        color: #2c3e50;
                    }}
                    .content {{
                        padding: 30px 0;
                    }}
                    .footer {{
                        padding: 20px 0;
                        font-size: 12px;
                        color: #7f8c8d;
                        border-top: 1px solid #f0f0f0;
                        text-align: center;
                    }}
                    .button {{
                        display: inline-block;
                        background-color: #3498db;
                        color: white;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        font-weight: bold;
                        margin: 20px 0;
                    }}
                    .attachment-info {{
                        background-color: #f8f9fa;
                        border-left: 4px solid #3498db;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }}
                    .date {{
                        color: #7f8c8d;
                        font-size: 14px;
                        margin-bottom: 20px;
                    }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <div class="logo">{company_name}</div>
                        <div class="date">{formatted_date}</div>
                    </div>
                    <div class="content">
                        <p>Dear Valued Client,</p>
                        
                        <p>Thank you for your interest in our services. As requested, please find attached the detailed PDF report for your review.</p>
                        
                        <div class="attachment-info">
                            <p><strong>Attachment:</strong> report.pdf</p>
                            <p>This document contains the information you requested. If you have any questions about the contents, please don't hesitate to contact us.</p>
                        </div>
                        
                        <p>Should you require any further information or have any questions, please feel free to reach out to us.</p>
                        
                        <p>Best regards,<br>
                        The {company_name} Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent to {receiver_email} from {company_name}.</p>
                        <p>© {current_date.year} {company_name}. All rights reserved.</p>
                        <p>Please do not reply to this automated email.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version for email clients that don't support HTML
            plain_text = f"""
            Dear Valued Client,
            
            Thank you for your interest in our services. As requested, please find attached the detailed PDF report for your review.
            
            Attachment: report.pdf
            
            Should you require any further information or have any questions, please feel free to reach out to us.
            
            Best regards,
            The {company_name} Team
            
            ---
            This email was sent to {receiver_email} from {company_name}.
            © {current_date.year} {company_name}. All rights reserved.
            """
        
            # Add content to the message
            msg.set_content(plain_text)
            msg.add_alternative(html_content, subtype='html')
            
            # Add the PDF attachment
            msg.add_attachment(pdf_data, maintype='application', subtype='pdf', filename='report.pdf')
            
            # Send the email
            try:
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                    smtp.login(sender_email, sender_password)
                    smtp.send_message(msg)
                return jsonify({"message": "Report generated and emailed successfully", "status": "success"}), 201
            except Exception as e:
                print("Error sending email:", e)
                return jsonify({"error": "Failed to send email"}), 500
        if pdf_response is not None:
            print("Error generating PDF:", pdf_response.text)
            return jsonify({"error": "Failed to generate report"}), 500
        else:
            print("Report generation failed with no response")
            return jsonify({"error": "Report generation failed"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000,debug=True)
    
