from flask import Blueprint, request, jsonify
from models import User, Specialty
from extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Extract specialty from data to avoid User model kwargs error
    specialty_name = data.pop('specialty', None)
    
    user = User(**data)
    
    if user.role == 'doctor' and specialty_name:
        specialty_name = specialty_name.strip()
        # Case insensitive search
        specialty = Specialty.query.filter(Specialty.name.ilike(specialty_name)).first()
        
        if not specialty:
            specialty = Specialty(name=specialty_name)
            db.session.add(specialty)
            db.session.flush()  # To get specialty.id before committing
            
        user.specialty_id = specialty.id

    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if user and user.password == data['password']:
        token = create_access_token(identity=str(user.id))
        
        specialty_name = None
        if user.role == 'doctor' and user.specialty_id:
            spec = Specialty.query.get(user.specialty_id)
            specialty_name = spec.name if spec else None

        return jsonify({
            "token": token, 
            "role": user.role,
            "user_id": user.id,
            "username": user.name,
            "specialty_name": specialty_name
        })

    return jsonify({"msg": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    })

@auth_bp.route('/users', methods=['GET'])
def get_users():
    role = request.args.get('role')
    if role:
        users = User.query.filter_by(role=role).all()
    else:
        users = User.query.all()
    
    result = []
    for u in users:
        specialty_name = None
        if u.specialty_id:
            spec = Specialty.query.get(u.specialty_id)
            specialty_name = spec.name if spec else None
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "specialty_id": u.specialty_id,
            "specialty_name": specialty_name
        })
    return jsonify(result)