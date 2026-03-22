import os
import sqlalchemy
from sqlalchemy import create_engine, text

# DATABASE_URL from db.py
DATABASE_URL = "mysql+pymysql://root:EsViUzxhSjaLZeZPtlePimkVhUNigccH@turntable.proxy.rlwy.net:45191/railway"

def test_connection():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Successfully connected to the database!")
            for row in result:
                print(f"Result: {row}")
    except Exception as e:
        print(f"Failed to connect to the database: {e}")

if __name__ == "__main__":
    test_connection()
