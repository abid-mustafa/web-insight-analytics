import pandas as pd
from database_operations.query_excecution import excecuteQuery

def FetchDataFromDBProphet(website_id, start_date,end_date):
    query = f"""SELECT visitor_id, created_at
    FROM sessions
    WHERE created_at BETWEEN '{start_date}' AND '{end_date}' AND website_id = {website_id}
    ORDER BY created_at ASC;
    """

    try:
        results = excecuteQuery(query)
        return results
    except Exception as e:
        print("failed to fetch data ", e)
        return 0
    
def DataOperationProphet(website_id, start_date,end_date):
    results = FetchDataFromDBProphet(website_id, start_date,end_date)
    if results:
        df = pd.DataFrame(results)

        # Convert session_start to datetime format
        df["created_at"] = pd.to_datetime(df["created_at"])

        # Show first few rows
        print("\n📊 Data Preview:")
        print(df.head())

        df_prophet = df.groupby(df["created_at"].dt.date)["visitor_id"].nunique().reset_index()

        # Rename columns for Prophet
        df_prophet.columns = ["ds", "y"]

        # Convert 'ds' column to datetime format
        df_prophet["ds"] = pd.to_datetime(df_prophet["ds"])

        # Show processed data
        print("\n📊 Prophet Input Data:")
        print(df_prophet.head())

        return df_prophet
    else:
        print("Not Data to perform operations")
        empty_df = pd.DataFrame()
        return empty_df
        return 0
        

