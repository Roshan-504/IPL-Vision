import pandas as pd
import numpy as np
from flask import jsonify

deliveries = pd.read_csv("./datasets/deliveries.csv")
matches = pd.read_csv("./datasets/matches.csv")


def get_total_bowler():
    bowlers = deliveries["bowler"].unique()

    total_bowler = set(bowlers)
    total_bowler = list(total_bowler)
    total_bowler.sort()

    return jsonify({"data" : total_bowler })

def get_bowler_info(bowler_name):

    # total wicket taken
    valid_dismissals = ["bowled", "caught", "lbw", "stumped", "hit wicket", "caught and bowled"]

    total_wickets = deliveries[
        (deliveries["bowler"] == bowler_name) & 
        (deliveries["is_wicket"] == 1) & 
        (deliveries["dismissal_kind"].notna()) &  # Exclude NaN values
        (deliveries["dismissal_kind"].isin(valid_dismissals))  # Only valid dismissals
    ]["is_wicket"].sum()

    # Total Runs Conceded (Excluding Byes & Leg-Byes)
    runs_conceded = deliveries[
        (deliveries["bowler"] == bowler_name) & 
        (~deliveries["extras_type"].fillna("").isin(["byes", "legbyes"]))
    ]["total_runs"].sum()

    # Count Only Legal Deliveries (Excluding Wides & No-Balls)
    legal_deliveries = deliveries[
        (deliveries["bowler"] == bowler_name) & 
        (~deliveries["extras_type"].fillna("").isin(["wides", "noballs"]))
    ].shape[0]

    # Calculate Overs Bowled Properly
    complete_overs = legal_deliveries // 6  
    remaining_balls = legal_deliveries % 6  
    overs_bowled = complete_overs + (remaining_balls / 6)

    # Calculate Economy Rate
    economy_rate = runs_conceded / overs_bowled if overs_bowled > 0 else 0

    # Calculate Bowling Strike Rate
    bowling_strike_rate = legal_deliveries / total_wickets if total_wickets > 0 else 0

    # Calculate Bowling Average
    bowling_avg = runs_conceded / total_wickets if total_wickets > 0 else 0

    # Count Dot Balls (Balls where runs = 0 and it's a legal delivery)
    dot_balls = deliveries[
        (deliveries["bowler"] == bowler_name) & 
        (deliveries["total_runs"] == 0) & 
        (~deliveries["extras_type"].fillna("").isin(["wides", "noballs"]))
    ].shape[0]

    # Calculate Dot Ball Percentage
    dot_ball_percentage = (dot_balls / legal_deliveries) * 100 if legal_deliveries > 0 else 0  

    data = {
        "TotalWickets": int(total_wickets),
        "DotBallPercentage": round(dot_ball_percentage, 2),
        "BowlingStrikeRate": round(bowling_strike_rate, 2),
        "EconomyRate": round(economy_rate, 2),
        "BowlingAverage": round(bowling_avg, 2) 
    }
    
    return jsonify(data)


def bowler_dismissal_kind(bowler_name):

    valid_dismissals = ["bowled", "caught", "lbw", "stumped", "hit wicket", "caught and bowled"]

    # Dictionary to store dismissal counts
    dismissal_counts = []

    # Total wickets taken for each dismissal type
    for dismissal in valid_dismissals:
        total_wickets_type = deliveries[
            (deliveries["bowler"] == bowler_name) & 
            (deliveries["is_wicket"] == 1) & 
            (deliveries["dismissal_kind"].notna()) &  # Exclude NaN values
            (deliveries["dismissal_kind"] == dismissal)  # Only valid dismissals
        ]["is_wicket"].count()  # Count the number of occurrences

        dismissal_counts.append(int(total_wickets_type))
    data = {
        "Dismissal Type": valid_dismissals,  # Convert Index to list
        "Dismissal Count": dismissal_counts  # Convert int64 to Python int
    }

    return jsonify(data)