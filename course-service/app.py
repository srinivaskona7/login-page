import os
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import urllib.parse

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get('MONGO_URI')
# Handle environment variable substitution for MONGO_URI
if MONGO_URI and '$(MONGO_ROOT_PASSWORD)' in MONGO_URI:
    mongo_password = os.environ.get('MONGO_ROOT_PASSWORD', 'mongodb-password')
    MONGO_URI = MONGO_URI.replace('$(MONGO_ROOT_PASSWORD)', urllib.parse.quote_plus(mongo_password))

client = MongoClient(MONGO_URI)
db = client.loginpagedb
courses_collection = db.courses

def seed_database():
    try:
        if courses_collection.count_documents({}) == 0:
            courses_collection.insert_many([
                { "title": "Kubernetes in Action", "imageUrl": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300" },
                { "title": "Designing Data-Intensive Applications", "imageUrl": "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300" },
                { "title": "Clean Code", "imageUrl": "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300" },
                { "title": "System Design Interview", "imageUrl": "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300" }
            ])
    except Exception as e:
        print(f"Database seeding error: {e}")

@app.route("/courses", methods=["GET"])
def get_courses():
    try:
        def serialize_doc(doc):
            doc["_id"] = str(doc["_id"])
            return doc
        seed_database()
        books = courses_collection.find().limit(4)
        return jsonify([serialize_doc(book) for book in books])
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return jsonify({"error": "Failed to fetch courses"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)