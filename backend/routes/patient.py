from flask import Blueprint, request, jsonify
from models import Appointment, User, Report
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/book', methods=['POST'])
@jwt_required()
def book():
    current_user_id = get_jwt_identity()
    data = request.json
    
    appt = Appointment(
        patient_id=int(current_user_id),
        doctor_id=data.get("doctor_id"),
        date=datetime.fromisoformat(data.get("date")) if data.get("date") else None,
        status="Pending"
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({"msg": "Appointment booked"})

@patient_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    # Base query - if patient, filter by patient_id; if doctor, filter by doctor_id
    if user and user.role == 'doctor':
        query = Appointment.query.filter_by(doctor_id=current_user_id)
    else:
        query = Appointment.query.filter_by(patient_id=current_user_id)

    # Filter by doctor
    doctor_id = request.args.get('doctor_id')
    if doctor_id:
        query = query.filter_by(doctor_id=int(doctor_id))

    # Filter by date (exact date match, ignoring time)
    date_str = request.args.get('date')
    if date_str:
        try:
            filter_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(db.func.date(Appointment.date) == filter_date)
        except ValueError:
            pass

    # Order by date descending (newest first)
    query = query.order_by(Appointment.date.desc())

    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    result = []
    for a in paginated.items:
        patient = User.query.get(a.patient_id)
        doctor = User.query.get(a.doctor_id)
        
        # Check if a report exists for this appointment
        report = Report.query.filter_by(appointment_id=a.id).first()
        
        result.append({
            "id": a.id,
            "patient_id": a.patient_id,
            "patient_name": patient.name if patient else "Unknown",
            "doctor_id": a.doctor_id,
            "doctor_name": doctor.name if doctor else "Unknown",
            "date": str(a.date),
            "has_report": bool(report),
            "report_text": report.text if report else "",
            "report_file_name": report.file_name if report else None
        })

    return jsonify({
        "appointments": result,
        "page": paginated.page,
        "per_page": paginated.per_page,
        "total": paginated.total,
        "total_pages": paginated.pages,
    })

@patient_bp.route('/report', methods=['POST'])
@jwt_required()
def upload_report():
    current_user_id = int(get_jwt_identity())
    
    appointment_id = request.form.get("appointment_id")
    patient_id = request.form.get("patient_id")
    text = request.form.get("text", "")
    
    file = request.files.get("file")
    
    # Check if report already exists for this appointment
    report = Report.query.filter_by(appointment_id=int(appointment_id)).first()
    
    if not report:
        report = Report(
            doctor_id=current_user_id,
            patient_id=int(patient_id),
            appointment_id=int(appointment_id)
        )
        db.session.add(report)

    # Update text
    report.text = text
    
    # Update file only if a new file is uploaded
    if file and file.filename != '':
        report.file_data = file.read()
        report.file_name = file.filename
        report.mime_type = file.mimetype
        
    db.session.commit()
    
    return jsonify({"msg": "Report saved successfully"}), 201

@patient_bp.route('/report/file/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_report_file(appointment_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    report = Report.query.filter_by(appointment_id=appointment_id).first()
    if not report or not report.file_data:
        return jsonify({"msg": "File not found"}), 404
        
    # Verify access: Only the patient or the doctor of this report can view it
    if user.role == 'patient' and report.patient_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    if user.role == 'doctor' and report.doctor_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    from flask import Response
    return Response(report.file_data, mimetype=report.mime_type, headers={
        "Content-Disposition": f"inline; filename={report.file_name}"
    })