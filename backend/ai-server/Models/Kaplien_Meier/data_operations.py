import pandas as pd
from database_operations.query_excecution import excecuteQuery

def FetchDataFromDbKM(website_id,start_date, end_date):
    query = f"""
    SELECT 
    e.session_id, 
    MIN(e.created_at) AS session_start, 
    MAX(e.created_at) AS session_end
    FROM events e
    JOIN sessions s ON e.session_id = s.id
    WHERE e.created_at BETWEEN '{start_date}' AND '{end_date}'
        AND s.website_id = {website_id}
    GROUP BY e.session_id;
    """

    try:
        results = excecuteQuery(query)
        return results
    except Exception as e:
        print("failed to fetch data ", e)
        return 0
    
def DataOperationKM(website_id, start_date, end_date):
    results = FetchDataFromDbKM(website_id,start_date,end_date)
    if results:
        df_sessions = pd.DataFrame(results, columns=["session_id", "session_start", "session_end"])
    
        # Ensure timestamps are converted to datetime
        df_sessions["session_start"] = pd.to_datetime(df_sessions["session_start"])
        df_sessions["session_end"] = pd.to_datetime(df_sessions["session_end"])
        
        # Show Data
        print(df_sessions.dtypes)  # Check data types
        print(df_sessions.head())   # Display data

        df_sessions["session_duration_hours"] = (df_sessions["session_end"] - df_sessions["session_start"]).dt.total_seconds() / 3600
        df_sessions = df_sessions[["session_id", "session_start", "session_end", "session_duration_hours"]]

        print(df_sessions.head(5))
        print(len(df_sessions))

        latest_date = df_sessions["session_start"].max()

        # Define churn (1 = churned, 0 = active)
        df_sessions["churned"] = (latest_date - df_sessions["session_end"]).dt.days > 30

        # Print churned users
        print(df_sessions.head())

        # Print available columns in df_retention
        print("\nAvailable Columns in df_sessions:\n", df_sessions.columns)

        return df_sessions
    else:
        print("Not Data to perform operations")
        empty_df = pd.DataFrame()
        return empty_df