import os

class Config:
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'postgresql://amaro:Amaroidex1@localhost:5432/dbfastsocial'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = ''

    FACEBOOK_APP_ID = ''
    FACEBOOK_APP_SECRET = ''
    TWITTER_API_KEY = ''
    TWITTER_API_SECRET_KEY = ''