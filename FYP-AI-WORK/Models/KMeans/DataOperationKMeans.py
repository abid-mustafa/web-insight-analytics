import pandas as pd
import json
from database_operations.QueryExcecution import excecuteQuery
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from kneed import KneeLocator

def FetchDataFromDBKMeans(query):
    try:
        results = excecuteQuery(query)
        return results
    except Exception as e:
        print("failed to fetch data ", e)
        return 0

def DataOperationKMeans(website_id, start_date,end_date):
    query = f"""
    SELECT 
        id,
        session_id, 
        website_id, 
        visitor_id, 
        country, 
        city, 
        device, 
        os, 
        browser, 
        created_at
    FROM sessions
    WHERE website_id = {website_id} AND created_at BETWEEN '{start_date}' AND '{end_date}';
    """
    sessions_df = pd.DataFrame(FetchDataFromDBKMeans(query))

    query = f"""
        SELECT 
        session_id, 
        MIN(created_at) AS session_start, 
        MAX(created_at) AS session_end
        FROM events
        GROUP BY session_id;
        """
    df_sessions = pd.DataFrame(FetchDataFromDBKMeans(query))

    query = f"""
       SELECT 
        s.session_id, 
        MIN(e.created_at) AS session_start, 
        MAX(e.created_at) AS session_end
        FROM events e
        JOIN sessions s ON e.session_id = s.id
        WHERE s.website_id = {website_id} AND e.created_at BETWEEN '{start_date}' AND '{end_date}'
        GROUP BY s.session_id;
    """
    sessionEnd_df = pd.DataFrame(FetchDataFromDBKMeans(query))

    query =  f"""
    SELECT 
        pv.session_id, 
        page_title, 
        page_url, 
        referrer, 
        pv.created_at
    FROM page_views pv
    JOIN sessions s ON pv.session_id = s.id
    WHERE s.website_id = {website_id} AND pv.created_at BETWEEN '{start_date}' AND '{end_date}';
    """
    pageviews_df = pd.DataFrame(FetchDataFromDBKMeans(query))

    query = f"""
    SELECT 
        s.id,
        s.visitor_id,
        COUNT(DISTINCT s.session_id) AS sessions_per_user
    FROM sessions s
    WHERE s.website_id = {website_id} AND s.created_at BETWEEN '{start_date}' AND '{end_date}'
    GROUP BY s.visitor_id, s.id;
    """
    sessionPerUser_df = pd.DataFrame(FetchDataFromDBKMeans(query))
    sessionPerUser_df.rename(columns={'id': 'session_id'}, inplace=True)

    query = f"""
    SELECT 
        e.session_id, 
        e.event_name, 
        e.page_url, 
        e.created_at
    FROM events e
    JOIN sessions s ON e.session_id = s.id
    WHERE s.website_id = {website_id} AND e.created_at BETWEEN '{start_date}' AND '{end_date}';
    """
    events_df = pd.DataFrame(FetchDataFromDBKMeans(query))

    # Fetch Transactions
    query = f"""
    SELECT 
        t.session_id, 
        t.transaction_id, 
        t.total_amount, 
        t.total_quantity, 
        t.shipping, 
        t.tax, 
        t.currency, 
        t.created_at, 
        t.updated_at
    FROM transactions t
    JOIN sessions s ON t.session_id = s.id
    WHERE s.website_id = {website_id} AND t.created_at BETWEEN '{start_date}' AND '{end_date}';
    """
    transactions_df = pd.DataFrame(FetchDataFromDBKMeans(query))

    if not sessions_df.empty and not sessionEnd_df.empty and not pageviews_df.empty and not sessionPerUser_df.empty and not events_df.empty and not transactions_df.empty:
        # Calculate session duration in minutes
        df_sessions["session_duration_minutes"] = (df_sessions["session_end"] - df_sessions["session_start"]).dt.total_seconds() / 60
        df_sessions = df_sessions[["session_id", "session_start", "session_end", "session_duration_minutes"]]

        # Bounce Rate: Sessions with only 1 page view
        pageviews_per_session = pageviews_df.groupby('session_id')['page_url'].count().reset_index()
        bounce_sessions = pageviews_per_session[pageviews_per_session['page_url'] == 1]
        bounce_rate = len(bounce_sessions) / len(sessions_df) * 100

        # Average Pages per Session
        avg_pages_per_session = pageviews_df.groupby('session_id')['page_url'].count().reset_index()
        avg_pages_per_session = avg_pages_per_session.rename(columns={'page_url': 'avg_pages_per_session'})
        avg_pages_per_session['avg_pages_per_session'] = avg_pages_per_session['avg_pages_per_session'] / len(sessions_df)

        # Ensure session_id is the same type for merging
        sessions_df['session_id'] = sessions_df['session_id'].astype(str)
        avg_pages_per_session['session_id'] = avg_pages_per_session['session_id'].astype(str)
        df_sessions['session_id'] = df_sessions['session_id'].astype(str) 
        sessionPerUser_df['session_id'] = sessionPerUser_df['session_id'].astype(str)

        sessions_features = pd.merge(df_sessions, sessionPerUser_df, on='session_id')
        sessions_features = pd.merge(sessions_features, avg_pages_per_session, on='session_id')

        print(sessions_features[['session_id', 'session_duration_minutes', 'sessions_per_user', 'avg_pages_per_session']].head())
        #print(df_sessions.head())
        print(bounce_rate)
        #print(sessions_per_user.head())
        #print(avg_pages_per_session.head())
        #print(sessions_features.head())
        print(len(sessions_features))

        # Check for missing values in the entire sessions_features dataframe
        missing_values = sessions_features.isnull().sum()

        # Display columns with missing values
        print("Missing Values in Each Column:")
        print(missing_values[missing_values > 0])

        # Optionally, you can check for missing values specifically in the important columns:
        print("Missing Values in Key Columns:")
        print(sessions_features[['session_duration_minutes', 'sessions_per_user', 'avg_pages_per_session', 'session_id']].isnull().sum())

        

        # Selecting numeric columns for scaling
        numeric_cols = ['session_duration_minutes', 'sessions_per_user', 'avg_pages_per_session']

        # Initialize the StandardScaler
        scaler = StandardScaler()

        # Apply scaling to the selected columns
        sessions_features[numeric_cols] = scaler.fit_transform(sessions_features[numeric_cols])

        # Display the scaled features
        print(sessions_features[['session_id', 'session_duration_minutes', 'sessions_per_user', 'avg_pages_per_session']].head())

        # Check the mean and standard deviation of scaled features
        print(sessions_features[numeric_cols].mean())  # Should be close to 0
        print(sessions_features[numeric_cols].std())   # Should be close to 1

        
        inertia = []
        k_range = range(1, 11)

        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=42)
            kmeans.fit(sessions_features[numeric_cols])
            inertia.append(kmeans.inertia_)

        # Use KneeLocator to find the optimal k
        knee = KneeLocator(k_range, inertia, curve='convex', direction='decreasing')
        optimal_k = knee.knee
        print(f"Optimal k detected: {optimal_k}")

        # Run KMeans with optimal k
        kmeans = KMeans(n_clusters=optimal_k, random_state=42)
        sessions_features['cluster'] = kmeans.fit_predict(sessions_features[numeric_cols])

        # Optional: Add cluster centers for interpretation
        cluster_centers = pd.DataFrame(
            scaler.inverse_transform(kmeans.cluster_centers_),
            columns=numeric_cols
        )

        print("Cluster Centers (Original Scale):")
        print(cluster_centers)

        def label_cluster(row):
            if row['cluster'] == 0:
                return "Returning Casuals"
            elif row['cluster'] == 1:
                return "One-time Visitors"
            elif row['cluster'] == 2:
                return "Engaged Explorers"
            elif row['cluster'] == 3:
                return "Suspiciously Long Sessions"
            
        sessions_features['cluster_label'] = sessions_features.apply(label_cluster, axis=1)

        

        # Convert DataFrame to JSON
        kmeans_json = {
            "k_means_results": {
                "number_of_clusters": len(cluster_centers),
                "feature_names": list(cluster_centers.columns),
                "clusters": []
            }
        }

        for i, row in cluster_centers.iterrows():
            cluster_data = {
                "cluster_id": int(i),
                "center": {col: float(row[col]) for col in cluster_centers.columns}
            }
            kmeans_json["k_means_results"]["clusters"].append(cluster_data)

        # Pretty print
        print(json.dumps(kmeans_json, indent=4))

        return kmeans_json
    
    else:
        print("Not Data to perform operations")
        empty_df = pd.DataFrame()
        return empty_df
        return 0











