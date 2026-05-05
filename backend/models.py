from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))  # patient, doctor
    specialty_id = db.Column(db.Integer, db.ForeignKey('specialty.id'), nullable=True)

class Specialty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

#Appointment: id, patient_id , doctor_id, date , status
class Appointment(db.Model):
    id =db.Column(db.Integer ,primary_key=True)
    patient_id= db.Column(db.Integer)
    #patient_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False)
    doctor_id = db.Column(db.Integer)
    date= db.Column(db.DateTime)
    status= db.Column(db.String(20))


#Prescription: id, appointment_id , diagnosis, medicines
class Prescription(db.Model):
    id =db.Column(db.Integer ,primary_key=True)
    appointment_id=db.Column(db.Integer)
    diagnosis= db.Column(db.String(200))
    medicines=db.Column(db.String(200))

# Report: stores PDF/Images and text notes for an appointment
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, nullable=False)
    doctor_id = db.Column(db.Integer, nullable=False)
    appointment_id = db.Column(db.Integer, nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=True) # bytea for file
    file_name = db.Column(db.String(255), nullable=True)
    mime_type = db.Column(db.String(100), nullable=True)
    text = db.Column(db.Text, nullable=True)