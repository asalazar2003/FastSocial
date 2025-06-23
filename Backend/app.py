from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from models import db, User, Post, SocialAccount
from config import Config
import datetime

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
jwt = JWTManager(app)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 409
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409
        
    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity={'id': user.id, 'username': user.username})
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/accounts', methods=['GET'])
@jwt_required()
def get_accounts():
    current_user = get_jwt_identity()
    accounts = SocialAccount.query.filter_by(user_id=current_user['id']).all()
    return jsonify([{"id": acc.id, "platform": acc.platform, "username": acc.username} for acc in accounts])

@app.route('/api/accounts/add', methods=['POST'])
@jwt_required()
def add_account():
    data = request.get_json()
    current_user = get_jwt_identity()
    
    # En una aplicación real, aquí iría el flujo OAuth con la API de la red social
    # Por simplicidad, añadimos la cuenta directamente
    new_account = SocialAccount(
        user_id=current_user['id'],
        platform=data['platform'],
        username=data['username'],
        access_token='fake-access-token-for-demo' # Este token se obtendría de OAuth
    )
    db.session.add(new_account)
    db.session.commit()
    return jsonify({"msg": f"{data['platform']} account added successfully"}), 201

@app.route('/api/posts', methods=['GET', 'POST'])
@jwt_required()
def handle_posts():
    current_user = get_jwt_identity()
    if request.method == 'POST':
        data = request.get_json()
        scheduled_at_dt = datetime.datetime.fromisoformat(data['scheduled_at'])
        new_post = Post(
            user_id=current_user['id'],
            account_id=data['account_id'],
            content=data['content'],
            scheduled_at=scheduled_at_dt
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({"msg": "Post scheduled successfully"}), 201

    posts = Post.query.filter_by(user_id=current_user['id']).order_by(Post.scheduled_at.desc()).all()
    return jsonify([{
        "id": p.id,
        "account_platform": p.account.platform,
        "account_username": p.account.username,
        "content": p.content,
        "status": p.status,
        "scheduled_at": p.scheduled_at.isoformat(),
        "likes": p.likes,
        "comments": p.comments,
        "shares": p.shares
    } for p in posts])

@app.route('/api/posts/<int:post_id>/metrics', methods=['GET'])
@jwt_required()
def get_post_metrics(post_id):
    current_user = get_jwt_identity()
    post = Post.query.filter_by(id=post_id, user_id=current_user['id']).first_or_404()
    
    # En una aplicación real, aquí llamarías a la API de la red social
    # para obtener métricas actualizadas. Usamos datos de ejemplo.
    post.likes = 150 
    post.comments = 42
    post.shares = 18
    db.session.commit()

    return jsonify({
        "id": post.id,
        "content": post.content,
        "likes": post.likes,
        "comments": post.comments,
        "shares": post.shares
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)