from flask import Flask, jsonify
from flask_cors import CORS
from controllers import batter_controller
from controllers import bowler_controller
from route.batter_route import batter_bp  
from route.bowler_route import bowler_bp
from route.team_route import team_bp
from route.predictor_route import predictor_bp


app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])



app.register_blueprint(batter_bp)
app.register_blueprint(bowler_bp)
app.register_blueprint(team_bp)
app.register_blueprint(predictor_bp)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)

