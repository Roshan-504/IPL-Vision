from flask import Flask, jsonify
from flask_cors import CORS
from routes import batter

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])  # Handle cors error

@app.route("/")
def index():
    return jsonify({
        "message": "Hello from backend!",
        "bye":"bye error kavi Roshan"
             }
    )

@app.route("/get-total-players")
def getTotalPlayers():
    total_players = batter.get_total_players()
    data = {"total_playes" : total_players}
    data = jsonify(data)
    return data

@app.route("/get-batter-info/<batter_name>")
def getBatterInfo(batter_name):
    data = batter.get_batter_info(batter_name)
    data = jsonify(data)
    return data

if __name__ == "__main__":
    app.run(debug=True)
