import pymysql
import pandas as pd
# from database_operations.db_connection import createConnection
from dotenv import load_dotenv
import os

load_dotenv()

def createConnection():
    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASS")
    database = os.getenv("DB_NAME")
    port = 3306

    try:
        print("Connecting to MySQL...")
        
        # Connect to MySQL
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Connected to MySQL!")
        return conn
    except Exception as e:
        print(f"Connection failed: {e}")
        return 0
    

def excecuteQuery(query):
    conn = createConnection()
    if(conn):
        # print(query)
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        return results
    else:
        print("Failed to fetched: DB connection not found")
        return 0