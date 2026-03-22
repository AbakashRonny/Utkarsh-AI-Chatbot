from db import SessionLocal, text

def verify_connection():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        print("Connected successfully via SessionLocal!")
        for row in result:
            print(f"Result: {row}")
        db.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    verify_connection()
