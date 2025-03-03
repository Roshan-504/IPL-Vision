from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Handle cors error

@app.route("/")
def index():
    return jsonify({
        "message": "Hello from backend!",
        "bye":"bye error kavi Roshan"
             }
    )

@app.route("/chart")
def chart():
    return jsonify({
            "labels": ["Roshan", "kavi", "Mar", "Apr", "May"],
            "datasets": [
            {
                "label": "Sales",
                "data": [30, 50, 80, 40, 100],
                "backgroundColor": "rgba(75, 192, 192, 0.6)",
            },
            ],
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
