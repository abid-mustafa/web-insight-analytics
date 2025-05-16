from .data_operation_KMeans import DataOperationKMeans
import pandas as pd
from Models.gemini_prompts import hitGemini
import json

def ExcecuteKMeans(website_id, start_date,end_date):
    kmeans_json = DataOperationKMeans(website_id,start_date,end_date)
    if kmeans_json:
        prompt = f"""
            Below is a JSON file representing the results of a K-Means clustering analysis on web session behavior data. The analysis grouped website visitors into 4 clusters based on:

            - Session duration in minutes  
            - Number of sessions per user  
            - Average pages viewed per session  

            Each cluster includes a suggested interpretation label.

            Please generate a **human-readable summary report** in structured **JSON format** that includes:

            1. `cluster_summaries`: A description of what each cluster represents in simple terms.
            2. `key_differences`: Bullet points comparing the main differences between the clusters.
            3. `business_insights`: Bullet points with actionable suggestions based on the clustering results.
            4. `cluster label`: Assign suitable label to each cluster according to the data only use the labels assingned instead of cluster_0,cluster_1 and so on.... donot return it individually

            ### JSON Data:
            {kmeans_json}

            ### Output Format:
            ```json
            {{
            "cluster_summaries": {{
                "cluster_0": "Plain-language summary of what this group represents.",
                "cluster_1": "Description...",
                "cluster_2": "Description...",
                "cluster_3": "Description..."
            }},
            "key_differences": [
                "Cluster 0 users spend less time but have more sessions.",
                "Cluster 2 users are high engagement with long sessions and many pages viewed.",
                "..."
            ],
            "business_insights": [
                "Retarget Cluster 0 users with content recommendations to boost session duration.",
                "Consider premium features or upsell campaigns for Cluster 2 users.",
                "..."
            ]
            }}
            provide a proper name for each cluster and use that in whole report. For Eg
            "cluster_0": "Plain-language summary of what this group represents.",
            "cluster_1": "Description...",
            instead of cluster 0 use name of cluster and same for cluster 1 and so on.
            """
        finalResults = hitGemini(prompt)
        return finalResults
    else:
        print("kmeans_json not found")
        return 0
