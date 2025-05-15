import pandas as pd
from database_operations.QueryExcecution import excecuteQuery
from sklearn.preprocessing import MinMaxScaler

def FetchDataFromDBTPS(website_id, start_date,end_date):
    query = f"""
        SELECT 
        t.transaction_id, 
        t.total_amount, 
        i.item_id, 
        i.item_name, 
        i.item_category,
        i.quantity, 
        i.price, 
        i.currency
        FROM transactions t
        JOIN items i ON t.id = i.transaction_id
        JOIN sessions s ON t.session_id = s.id
        WHERE s.website_id = {website_id}
        AND t.created_at BETWEEN '{start_date}' AND '{end_date}'
    """

    try:
        results = excecuteQuery(query)
        return results
    except Exception as e:
        print("failed to fetch data ", e)
        return 0
    
def DataOperationTPS(website_id, start_date,end_date):
    results = FetchDataFromDBTPS(website_id, start_date,end_date)
    if results:
        df_products = pd.DataFrame(results, columns=["transaction_id", "total_amount", "item_id", "item_name", "item_category", "quantity", "price", "currency"])

        print(len(df_products))
        # Drop rows with missing item_name or quantity
        df_products = df_products.dropna(subset=['item_name', 'quantity'])

        # Convert quantity to integer
        df_products['quantity'] = df_products['quantity'].astype(int)
        print(len(df_products))

        df_products['total_revenue'] = df_products['price'] * df_products['quantity']
        top_revenue = df_products.groupby(['item_id', 'item_name']).agg({
            'quantity': 'sum',
            'total_revenue': 'sum'
        }).reset_index()

        top_revenue = top_revenue.sort_values(by='total_revenue', ascending=False)
        print(top_revenue.head(10))  # Top 10 products

        # Calculate revenue per item row
        df_products['revenue'] = df_products['quantity'] * df_products['price']

        # Group by item_id to get total revenue and total quantity
        top_selling = df_products.groupby(
            ['item_id', 'item_name', 'item_category']
        ).agg(
            total_quantity=('quantity', 'sum'),
            total_revenue=('revenue', 'sum')
        ).reset_index()

        top_selling_sorted = top_selling.sort_values(
            by=['total_revenue', 'total_quantity'],
            ascending=False
        )

        scaler = MinMaxScaler()
        top_selling_normalized = top_selling.copy()
        top_selling_normalized[['total_quantity', 'total_revenue']] = scaler.fit_transform(
            top_selling_normalized[['total_quantity', 'total_revenue']]
        )

        top_selling_json = top_selling_sorted.head(10).to_dict(orient='records')

        return top_selling_json
    else:
        print("Not Data to perform operations")
        empty_df = pd.DataFrame()
        return empty_df
        return 0









