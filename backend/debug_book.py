from app import create_app
from extensions import db
from models import User, Appointment
from flask_jwt_extended import create_access_token

app = create_app()
with app.app_context():
    patient = User.query.filter_by(role='patient').first()
    token = create_access_token(identity=str(patient.id))
    
    with app.test_client() as client:
        res = client.post('/api/patient/book', 
            json={"doctor_id": 4, "date": "2026-05-05T10:00:00"},
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Status: {res.status_code}")
        print(f"Response: {res.get_json()}")
