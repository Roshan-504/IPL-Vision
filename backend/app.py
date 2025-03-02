from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Handle cors error

@app.route("/")
def index():
    return jsonify({
        "message": "Hello from backend!",
        "bye":"bye error"
             }
    )

if __name__ == "__main__":
    app.run(debug=True)
