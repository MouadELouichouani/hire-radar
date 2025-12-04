from sqlalchemy import Column, DateTime, Enum, Integer, String, Text

from core import database as db


class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {'schema': 'public'}

    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(Text)
    role = Column(Enum("employer", "candidate"), nullable=False)
    created_at = Column(DateTime, server_default=db.text("CURRENT_TIMESTAMP"))

    def __repr__(self):
        return f"<Name : {self.full_name}>"
