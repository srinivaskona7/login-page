import os
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client.loginpagedb
courses_collection = db.courses

def seed_database():
    if courses_collection.count_documents({}) == 0:
        courses_collection.insert_many([
            { "title": "Kubernetes in Action", "imageUrl": "https://m.media-amazon.com/images/I/8144a4x5bVL._SL1500_.jpg" },
            { "title": "Designing Data-Intensive Applications", "imageUrl": "https://m.media-amazon.com/images/I/91J9E06r9-L._SL1500_.jpg" }
        ])

@app.route("/courses", methods=["GET"])
def get_courses():
    def serialize_doc(doc):
        doc["_id"] = str(doc["_id"])
        return doc
    seed_database()
    books = courses_collection.find().limit(2)
    return jsonify([serialize_doc(book) for book in books])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)