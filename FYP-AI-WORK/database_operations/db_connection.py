import pymysql
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

def createConnection():
    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASS")
    database = os.getenv("DB_NAME")
    port = 3306
    print(host," ",user," ",password," ",database)

    try:
        print("🔄 Connecting to MySQL...")
        
        # Connect to MySQL
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✅ Connected to MySQL!")
        return conn
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return 0