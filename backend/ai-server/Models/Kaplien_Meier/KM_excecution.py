from lifelines import KaplanMeierFitter
from .data_operations import DataOperationKM
import pandas as pd
from Models.gemini_prompts import hitGemini

def ExcecuteKM(website_id, start_date,end_date):
    df_sessions = DataOperationKM(website_id, start_date,end_date)
    if not df_sessions.empty:
        kmf = KaplanMeierFitter()

        # Fit model using retention days & churn status
        kmf.fit(durations=df_sessions["session_duration_hours"], event_observed=df_sessions["churned"])

        survival_data = pd.DataFrame({
            "days_since_first_visit": kmf.timeline,
            "survival_probability": kmf.survival_function_.values.flatten()
        })

        # Convert DataFrame to JSON
        survival_json = {"data": survival_data.to_dict(orient="records")}

        prompt = f"""
            Analyze the following user retention data from a **Kaplan-Meier Survival Analysis** and generate a structured, human-readable summary.

            ### **Data Format:**  
            The dataset contains **Kaplan-Meier survival estimates**, representing the probability of users remaining active over time.  
            Each record includes:  
            - "days_since_first_visit": Days since the user's first visit.  
            - "survival_probability": The likelihood of users being retained at each time point.

            ### **Data:**
            {survival_json}

            ### **Analysis Instructions:**  
            1. **Current Performance:**  
            - Summarize the overall user retention trend.  
            - Identify the most significant drop-off points.  
            - Highlight any anomalies or deviations in the retention pattern.  

            2. **Future Predictions:**  
            - Based on the observed survival probabilities, estimate retention rates for **30, 60, and 90 days**.  
            - Identify how long users typically stay engaged.  
            - If possible, compare this trend to industry benchmarks.  

            3. **Actionable Suggestions:**  
            - Recommend strategies to improve retention at major drop-off points.  
            - Suggest specific engagement tactics, A/B testing ideas, or product optimizations.  
            - Provide insights on retention best practices used by successful platforms.  

            ### **Expected Output Format:**  
            Return the response as a **structured JSON**:  

            ```json
            {{
            "current_performance": "Summary of retention trends and key observations.",
            "future_predictions": {{
                "30_days": "Estimated retention rate after 30 days.",
                "60_days": "Estimated retention rate after 60 days.",
                "90_days": "Estimated retention rate after 90 days."
            }},
            "actionable_suggestions": [
                "Strategy 1 to improve retention...",
                "Strategy 2...",
                "Strategy 3..."
            ]
            }}
        """

        finalResult = hitGemini(prompt)

        if finalResult:
            return finalResult
        
    else:
        print("df sessions not found")
        return 0


        

