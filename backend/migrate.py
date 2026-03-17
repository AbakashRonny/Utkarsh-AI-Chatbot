from db import engine, Base, User, Conversation

def migrate():
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables with new schema...")
    Base.metadata.create_all(bind=engine)
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
