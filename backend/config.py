class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:tomriddle@localhost/healthcare2db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "secret123"
