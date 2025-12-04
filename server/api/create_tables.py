
from config.db import Base, engine
from core.models import User

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")