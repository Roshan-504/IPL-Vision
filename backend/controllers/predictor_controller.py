import os
import sys
import pickle
import pandas as pd
from flask import jsonify, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
MODEL_PATH = os.path.join(BACKEND_DIR, "models", "win_predictor_svm.pkl")

# Lazy-loaded model artifact cache
_model_cache = None


def load_model_artifact():
    global _model_cache
    if _model_cache is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Trained SVM model not found at {MODEL_PATH}. Run train_svm_model.py first.")
        with open(MODEL_PATH, "rb") as f:
            _model_cache = pickle.load(f)
    return _model_cache


def get_predictor_metadata():
    """Return available teams, venues/cities, and model performance metrics."""
    try:
        artifact = load_model_artifact()
        return jsonify({
            "status": "success",
            "teams": artifact["teams"],
            "cities": artifact["cities"],
            "model_type": artifact.get("model_type", "Calibrated Linear Support Vector Machine"),
            "accuracy": round(artifact.get("accuracy", 0.8069) * 100, 2)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


def predict_win_probability():
    """
    Predict ball-by-ball match win probabilities for chasing vs defending team.
    Expects JSON payload with:
      - batting_team (chasing)
      - bowling_team (defending)
      - city (venue)
      - target_runs (int)
      - current_score (int)
      - overs_bowled (float e.g. 15.2 or int)
      - wickets_lost (int, 0 to 10)
    """
    try:
        data = request.get_json(force=True)
        artifact = load_model_artifact()
        pipeline = artifact["pipeline"]

        batting_team = data.get("batting_team", "").strip()
        bowling_team = data.get("bowling_team", "").strip()
        city = data.get("city", "Bangalore").strip()
        
        target_runs = int(data.get("target_runs", 180))
        current_score = int(data.get("current_score", 0))
        overs_bowled = float(data.get("overs_bowled", 0.0))
        wickets_lost = int(data.get("wickets_lost", 0))

        if not batting_team or not bowling_team:
            return jsonify({"status": "error", "message": "Both batting and bowling teams must be provided."}), 400

        if batting_team == bowling_team:
            return jsonify({"status": "error", "message": "Batting and bowling teams cannot be the same."}), 400

        # Calculate exact balls bowled
        overs_completed = int(overs_bowled)
        balls_remainder = int(round((overs_bowled - overs_completed) * 10))
        balls_remainder = min(balls_remainder, 5) # Max 5 balls in an incomplete over
        total_balls_bowled = min(120, overs_completed * 6 + balls_remainder)

        balls_left = max(0, 120 - total_balls_bowled)
        runs_left = max(0, target_runs - current_score)
        wickets_left = max(0, 10 - wickets_lost)

        # Run rates
        crr = round((current_score * 6) / total_balls_bowled, 2) if total_balls_bowled > 0 else 0.0
        rrr = round((runs_left * 6) / balls_left, 2) if balls_left > 0 else 0.0

        # Edge cases: Completed matches
        if runs_left <= 0:
            return jsonify({
                "status": "success",
                "batting_team": batting_team,
                "bowling_team": bowling_team,
                "batting_win_prob": 100.0,
                "bowling_win_prob": 0.0,
                "runs_left": 0,
                "balls_left": balls_left,
                "wickets_left": wickets_left,
                "crr": crr,
                "rrr": 0.0,
                "match_state": "Target Achieved! Chasing team has won."
            })

        if wickets_left <= 0:
            return jsonify({
                "status": "success",
                "batting_team": batting_team,
                "bowling_team": bowling_team,
                "batting_win_prob": 0.0,
                "bowling_win_prob": 100.0,
                "runs_left": runs_left,
                "balls_left": balls_left,
                "wickets_left": 0,
                "crr": crr,
                "rrr": rrr,
                "match_state": "All Out! Defending team has won."
            })

        if balls_left <= 0:
            return jsonify({
                "status": "success",
                "batting_team": batting_team,
                "bowling_team": bowling_team,
                "batting_win_prob": 0.0,
                "bowling_win_prob": 100.0,
                "runs_left": runs_left,
                "balls_left": 0,
                "wickets_left": wickets_left,
                "crr": crr,
                "rrr": rrr,
                "match_state": "Overs Completed! Defending team has won."
            })

        # Model input dataframe
        input_df = pd.DataFrame([{
            'batting_team': batting_team,
            'bowling_team': bowling_team,
            'city': city,
            'runs_left': runs_left,
            'balls_left': balls_left,
            'wickets_left': wickets_left,
            'target_runs': target_runs,
            'crr': crr,
            'rrr': rrr
        }])

        probabilities = pipeline.predict_proba(input_df)[0]
        # Class 0: Defending/Bowling team wins, Class 1: Chasing/Batting team wins
        defending_prob = round(float(probabilities[0]) * 100, 1)
        chasing_prob = round(float(probabilities[1]) * 100, 1)

        return jsonify({
            "status": "success",
            "batting_team": batting_team,
            "bowling_team": bowling_team,
            "batting_win_prob": chasing_prob,
            "bowling_win_prob": defending_prob,
            "runs_left": runs_left,
            "balls_left": balls_left,
            "wickets_left": wickets_left,
            "crr": crr,
            "rrr": rrr,
            "target_runs": target_runs,
            "current_score": current_score,
            "overs_bowled": f"{overs_completed}.{balls_remainder}",
            "match_state": "In Progress"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
