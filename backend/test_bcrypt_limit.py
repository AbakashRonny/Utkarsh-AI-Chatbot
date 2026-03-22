import hashlib
from passlib.context import CryptContext
import traceback

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_hash_length():
    # Simulate a very long password
    long_password = "a" * 100
    print(f"Original password length: {len(long_password)}")
    
    # Pre-hash like in auth.py
    sha_hash = hashlib.sha256(long_password.encode('utf-8')).hexdigest()
    print(f"SHA256 hex digest: {sha_hash}")
    print(f"Hex digest length: {len(sha_hash)}")
    print(f"Hex digest byte length: {len(sha_hash.encode('utf-8'))}")
    
    try:
        # Try to hash the hex digest
        print("Attempting to hash...")
        hashed = pwd_context.hash(sha_hash)
        print("Successfully hashed!")
    except Exception as e:
        print(f"FAILED to hash: {e}")
        # traceback.print_exc()

    # Try 71 chars
    print("\nTrying 71 chars...")
    try:
        short = "a" * 71
        pwd_context.hash(short)
        print("71 chars OK")
    except Exception as e:
        print(f"71 chars FAILED: {e}")

    # Try 72 chars
    print("\nTrying 72 chars...")
    try:
        exact = "a" * 72
        pwd_context.hash(exact)
        print("72 chars OK")
    except Exception as e:
        print(f"72 chars FAILED: {e}")

    # Try 73 chars
    print("\nTrying 73 chars...")
    try:
        too_long = "a" * 73
        pwd_context.hash(too_long)
        print("73 chars OK")
    except Exception as e:
        print(f"73 chars FAILED: {e}")

if __name__ == "__main__":
    test_hash_length()
