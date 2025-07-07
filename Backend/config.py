import os

class Config:
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:Amaroidex1.@localhost/dbfastsocial'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'mi-clave-secreta-2025'

    FACEBOOK_APP_ID = ''
    FACEBOOK_APP_SECRET = ''
    TWITTER_API_KEY = ''
    TWITTER_API_SECRET_KEY = ''