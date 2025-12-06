from flask import Flask, jsonify
from flask_cors import CORS
from config.db import Base, engine
from routes.auth import auth
from routes.job import job
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env file from server root directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
Base.metadata.create_all(bind=engine)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:3000"],
    allow_headers=["Content-Type", "Authorization"],
)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(job, url_prefix="/api/jobs")


@app.route("/")
def home():
    return jsonify({"message": "Server is running", "status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
