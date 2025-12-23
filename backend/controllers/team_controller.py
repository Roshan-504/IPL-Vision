import pandas as pd
import numpy as np
from flask import jsonify

deliveries = pd.read_csv("./datasets/deliveries.csv")
matches = pd.read_csv("./datasets/matches.csv")
team_info = pd.read_csv("./datasets/teams_info.csv")

matches["team1"] = matches["team1"].replace({
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
})
matches["team2"] = matches["team2"].replace({
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
})

matches["toss_winner"] = matches["toss_winner"].replace({
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
})
matches["winner"] = matches["winner"].replace({
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
})

deliveries["batting_team"] = deliveries["batting_team"].replace({
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
})
deliveries["bowling_team"] = deliveries["bowling_team"].replace({
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
})


def get_total_teams():
    teams = deliveries["batting_team"].unique()
    teams = list(teams)
    teams.sort()
    return jsonify({"data" : teams})

def get_team_info(team_name):
    matches_played_by_team = matches[(matches["team1"] == team_name) | (matches["team2"] == team_name)]
    total_matches_played = int(matches_played_by_team.shape[0])
    total_runs = int(deliveries[deliveries["batting_team"] == team_name]["total_runs"].count())
    total_matches_won = int(matches_played_by_team[matches_played_by_team["winner"] == team_name].shape[0])
    season_won = int(matches_played_by_team[(matches_played_by_team["match_type"] == "Final") & (matches_played_by_team["winner"] == team_name)].shape[0])

    data = {
        "total_matches_played" : total_matches_played,
        "total_runs" : total_runs,
        "total_matches_won" : total_matches_won,
        "season_won" : season_won
    }

    return jsonify(data)

def get_top_batters(team_name):
    batters = deliveries[deliveries["batting_team"] == team_name].groupby("batter")["batsman_runs"].sum().sort_values(ascending=False).head(10)

    data = {
        "label" : batters.index.to_list(),
        "runs" : batters.values.tolist()
    }

    return jsonify(data)

def get_top_bowlers(team_name):
    # Define valid dismissal types

    valid_dismissals = ["bowled", "caught", "lbw", "stumped", "hit wicket", "caught and bowled"]

    # Filter data for valid dismissals & RCB bowlers
    wickets = deliveries[
        (deliveries["bowling_team"] == team_name) & 
        (deliveries["is_wicket"] == 1) & 
        (deliveries["dismissal_kind"].notna()) & 
        (deliveries["dismissal_kind"].isin(valid_dismissals))
    ]

    # Count wickets per bowler
    bowler_wicket_counts = (
        wickets.groupby("bowler")["is_wicket"]
        .count()
        .reset_index()
        .rename(columns={"is_wicket": "total_wickets"})
        .sort_values(by="total_wickets", ascending=False)
    )

    bowler_wicket_counts = bowler_wicket_counts.head(10)
    Bowler_Name  = bowler_wicket_counts["bowler"].tolist()
    Bowler_Wicket  = bowler_wicket_counts["total_wickets"].tolist()

    data = {
        "label" : Bowler_Name,
        "total wikets" : Bowler_Wicket
    }

    return jsonify(data)