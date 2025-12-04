from flask import Flask, jsonify
from flask_cors import CORS
from config.db import Base, engine
from routes.auth import auth

app = Flask(__name__)
Base.metadata.create_all(bind=engine)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:3000"],
    allow_headers=["Content-Type", "Authorization"],
)

app.register_blueprint(auth, url_prefix="/api/auth")


@app.route("/")
def home():
    return jsonify({"message": "Server is running", "status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)