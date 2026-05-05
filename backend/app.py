from flask import Flask
import os
from config import Config
from extensions import db, jwt
from flask_cors import CORS

# Import Blueprints
from routes.auth import auth_bp
from routes.patient import patient_bp


def create_app():
    app = Flask(__name__)

    # Load Config
    app.config.from_object(Config)

    #  ADD THIS PART (DATABASE_URL from Render)
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if DATABASE_URL:
        # Fix for Render (postgres → postgresql)
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")
        app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(patient_bp, url_prefix="/api/patient")

    # Default Route
    @app.route("/")
    def home():
        return {"message": "Healthcare API Running"}

    # Create tables
    with app.app_context():
        db.create_all()

    return app


# Create the global app instance for Gunicorn
app = create_app()

# Run App (Local Development)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)