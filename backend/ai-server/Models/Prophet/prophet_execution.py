from prophet import Prophet
from .data_operation_prophet import DataOperationProphet
import pandas as pd
from Models.gemini_prompts import hitGemini
import json

def ExecuteProphet(website_id, start_date,end_date):
    df_prophet = DataOperationProphet(website_id, start_date,end_date)
    if not df_prophet.empty:
        # Initialize Prophet Model
        model = Prophet()

        # Fit the model with historical data
        model.fit(df_prophet)

        # Define future prediction range (e.g., next 60 days)
        future = model.make_future_dataframe(periods=30)

        # Generate forecast
        forecast = model.predict(future)

        # Display forecasted values
        print(forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].head())

        # Extract relevant columns from Prophet forecast
        forecast_data = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]

        # Convert to JSON
        forecast_json = forecast_data.to_json(orient="records")

        prompt = f"""
            You are an AI assistant analyzing **user retention trends** based on a 30-day forecast of daily returning users.

            ### Data Summary:
            This JSON contains forecasted user retention values for the next 30 days, including confidence intervals. The data reflects historical trends and predicted engagement behavior.

            ### Your Task:
            Analyze the data and generate an AI-driven report structured as a single **JSON object** with the following fields:

            1. **"current_performance"**:  
            Provide a detailed, paragraph-style analysis of retention trends observed in the historical data leading up to the forecast. Mention patterns, fluctuations, anomalies, or drop-offs, and describe possible interpretations.

            2. **"future_predictions"**:  
            Offer a rich interpretation of the next 30 days. Include estimated average daily returning users, noticeable patterns (peaks/troughs), and commentary on uncertainty or confidence intervals. Use paragraph form.

            3. **"actionable_suggestions"**:  
            Give 4-5 strategic recommendations to improve user retention. These should be paragraph-length insights with justification, covering tactics like personalization, segmentation, engagement campaigns, or feedback mechanisms.

            ### Important Notes:
            - **Do NOT mention the forecasting model or its name.**
            - **Return only the final JSON response — no markdown, no titles, no commentary.**
            - Each JSON field must contain **complete paragraph-style explanations**, not just bullet points or phrases.

            **JSON Data:**  
            {forecast_json}
            """


        
        finalResult = hitGemini(prompt)
        print(finalResult)

        if finalResult:
            return finalResult
    else:
        print("df prophet not found")
        return 0