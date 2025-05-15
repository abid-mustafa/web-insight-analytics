from .DataOperationTPS import DataOperationTPS
import pandas as pd
from Models.GeminiPrompts import hitGemini
import json

def ExecuteTPS(website_id, start_date,end_date):
    top_selling_json = DataOperationTPS(website_id, start_date,end_date)
    if top_selling_json:
        prompt = f"""
                Below is a JSON file representing the analysis of top-selling products for Website ID 1 during the period from 2020-11-01 to 2020-12-31. The data includes:

                - Item ID, Name, and Category  
                - Quantity Sold  
                - Total Revenue  

                This data was collected from the e-commerce transaction logs. Please generate a **human-readable summary report** in structured **JSON format** that includes:

                1. `product_summaries`: A plain-language summary of what each top product represents (e.g., popularity, sales impact).
                2. `key_differences`: Bullet points comparing the top products in terms of revenue and quantity.
                3. `business_insights`: Bullet points with actionable suggestions for marketing, bundling, or product placement based on the data.
                4. `product_recommendations`: Suggest which products should be prioritized in promotions or featured on the homepage.

                ### JSON Data:
                {top_selling_json}

                ### Output Format:
                ```json
                {{
                "product_summaries": {{
                    "9195292": "Google Canteen Bottle Black sold the most units and generated the highest revenue.",
                    "9195140": "Google Utility Backpack had strong sales volume and revenue performance.",
                    "9197759": "Google Incognito Techpack V2 generated high revenue despite fewer units sold."
                }},
                "key_differences": [
                    "9195292 sold the highest quantity (223 units), generating $4382 revenue.",
                    "9195140 had slightly fewer units (44) but almost equal revenue to the top product.",
                    "9197759 sold fewer units but had a high average price per unit."
                ],
                "business_insights": [
                    "Feature 9195292 in seasonal sales campaigns due to its broad appeal.",
                    "Bundle 9195140 with other lifestyle products to increase basket size.",
                    "Use 9197759 in premium product promotions or loyalty offers."
                ],
                "product_recommendations": [
                    "Promote 9195292 as a best-seller on the homepage.",
                    "Include 9195140 in targeted email marketing.",
                    "Highlight 9197759 in social media campaigns for exclusive deals."
                ]
                }}
                """
        finalResult = hitGemini(prompt)
        return finalResult
    else:
        print("top_selling_json not found")
        return 0

