from backend.app import create_app
from backend.extensions import db
from backend.models import User

app = create_app()
with app.app_context():
    user = User.query.first()
    print("User:", user.email, user.password)
