from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class SocialAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(120), nullable=False)
    access_token = db.Column(db.String(512), nullable=False)
    user = db.relationship('User', backref=db.backref('social_accounts', lazy=True))

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('social_account.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='scheduled')
    scheduled_at = db.Column(db.DateTime, nullable=False)
    posted_at = db.Column(db.DateTime, nullable=True)
    likes = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    shares = db.Column(db.Integer, default=0)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
    account = db.relationship('SocialAccount', backref=db.backref('posts', lazy=True))