import os, requests, random, bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
import urllib.parse

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get('MONGO_URI')
# Handle environment variable substitution for MONGO_URI
if MONGO_URI and '$(MONGO_ROOT_PASSWORD)' in MONGO_URI:
    mongo_password = os.environ.get('MONGO_ROOT_PASSWORD', 'mongodb-password')
    MONGO_URI = MONGO_URI.replace('$(MONGO_ROOT_PASSWORD)', urllib.parse.quote_plus(mongo_password))

NOTIFICATION_URL = os.environ.get('NOTIFICATION_SERVICE_URL')

client = MongoClient(MONGO_URI)
db = client.loginpagedb
users_collection = db.users
pending_verifications = {}

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get('email')
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists"}), 409
    
    otp = str(random.randint(100000, 999999))
    pending_verifications[email] = {
        "otp": otp, "data": data, "expiry": datetime.utcnow() + timedelta(minutes=10)
    }

    try:
        response = requests.post(f"{NOTIFICATION_URL}/send-otp", json={"email": email, "otp": otp}, timeout=10)
        if response.status_code != 200:
            return jsonify({"error": "Failed to send OTP"}), 500
        return jsonify({"message": "OTP sent successfully"}), 200
    except requests.exceptions.RequestException as e:
        print(f"Notification service error: {e}")
        return jsonify({"error": "Failed to contact notification service"}), 500

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp_provided = data.get('otp')
    pending_user = pending_verifications.get(email)

    if not pending_user or datetime.utcnow() > pending_user['expiry']:
        return jsonify({"error": "OTP is invalid or has expired"}), 400

    if pending_user['otp'] == otp_provided:
        user_data = pending_user['data']
        hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
        users_collection.insert_one({
            "firstName": user_data['firstName'], "lastName": user_data['lastName'],
            "email": user_data['email'], "password": hashed_password,
            "passwordHint": user_data['passwordHint']
        })
        del pending_verifications[email]
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"error": "Invalid OTP"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users_collection.find_one({"email": data.get('email')})
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({
            "firstName": user['firstName'], "lastName": user['lastName']
        }), 200
    return jsonify({"error": "Invalid email or password"}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)