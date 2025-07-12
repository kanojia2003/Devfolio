from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Parser service up 🚀"})

if __name__ == "__main__":
    app.run(debug=True, port=5002)
