import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from parser import extract_resume_text, parse_resume_data
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Resume Parser is Running!"})

@app.route("/parse-resume", methods=["POST"]) # Endpoint to parse resume
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    file = request.files['resume']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        text = extract_resume_text(file_path)
        parsed_data = parse_resume_data(text)
        return jsonify(parsed_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 7000)))
