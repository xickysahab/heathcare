from flask import Flask
from config import Config
from extensions import db, jwt
from flask_cors import CORS

# Import Blueprints
from routes.auth import auth_bp
from routes.patient import patient_bp
# (You can add doctor_bp later if created)

def create_app():
    app = Flask(__name__)

    # Load Config
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(patient_bp, url_prefix="/api/patient")

    # Default Route (for testing)
    @app.route("/")
    def home():
        return {"message": "Healthcare API Running "}

    return app


# Run App
if __name__ == "__main__":
    app = create_app()

    # Create Tables Automatically
    with app.app_context():
        db.create_all()

    app.run(debug=True)