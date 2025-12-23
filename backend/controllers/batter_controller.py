import pandas as pd
import numpy as np
from flask import jsonify

deliveries = pd.read_csv("./datasets/deliveries.csv")
matches = pd.read_csv("./datasets/matches.csv")

def get_total_players():
    batters = deliveries["batter"].unique()
    strikers = deliveries["non_striker"].unique()

    # Compute the union using set operations (fastest)
    total_platers = set(batters) | set(strikers)
    total_platers = list(total_platers)
    total_platers.sort()

    return jsonify({"data" : total_platers})

def get_batter_info(batter_name):
    total_matches_played = int(deliveries[(deliveries["batter"] == batter_name) | (deliveries["non_striker"] == batter_name)]["match_id"].nunique())

    # Filter deliveries where the player is the batter
    player_data = deliveries[deliveries["batter"] == batter_name]

    # Total Runs Scored
    total_runs = int(player_data["batsman_runs"].sum())

    # Total Dismissals (count of player_dismissed occurrences)
    total_dismissals = deliveries[deliveries["player_dismissed"] == batter_name].shape[0]

    # Batting Average  If a player is never dismissed, the average is set to infinity.
    batting_average = f"{total_runs / total_dismissals:.2f}" if total_dismissals > 0 else float('inf')

    # Total Balls Faced
    total_balls_faced = player_data.shape[0]

    # Strike Rate Formula
    strike_rate = f"{(total_runs / total_balls_faced) * 100:.2f}" if total_balls_faced > 0 else 0

    #Highest Score
    highest_score = int(player_data.groupby("match_id")["batsman_runs"].sum().max())

    data = {
        "total_matches_played" : total_matches_played,
        "total_runs" : total_runs,
        "batting_average" : batting_average,
        "strike_rate" : strike_rate,    
        "highest_score" : highest_score
    }

    return jsonify(data)

    
def seasons_vs_runs(batter_name):
    season_name = []
    season_runs = []
    
    # Group match IDs by season
    matches_per_season = matches.groupby("season")["id"].apply(list).reset_index()

    # Create DataFrame with season and match IDs
    season_match_ids = pd.DataFrame({
        "season": matches_per_season["season"],
        "match_ids": matches_per_season["id"]
    })

    # Iterate through each season
    for selected_season in season_match_ids["season"]:
        
        season_name.append(selected_season)
        
        # Get match IDs for the selected season
        match_ids_for_season = season_match_ids.loc[season_match_ids["season"] == selected_season, "match_ids"].iloc[0]
        
        # Filter deliveries dataset for the selected season
        season_data = deliveries[deliveries["match_id"].isin(match_ids_for_season)]
        
        # Get total runs for the batter
        total_runs = season_data[season_data["batter"] == batter_name]["batsman_runs"].sum().item()
        
        season_runs.append(total_runs)

    # Return after processing all seasons
    data =  {
        'label': season_name,
        'Runs Per Season': season_runs
    }
    return jsonify(data)

def fours_per_season(batter_name):
    matches_per_season = matches.groupby("season")["id"].apply(list).reset_index()

    # Store results
    season_name = []
    season_runs_four = []

    # Iterate over each season
    for index, row in matches_per_season.iterrows():
        selected_season = row["season"]
        match_ids_for_season = row["id"]  # This is already a list of match_ids

        # Filter deliveries for selected season
        season_data = deliveries[deliveries["match_id"].isin(match_ids_for_season)]
        
        # Count the number of sixes hit by the given batter
        total_four = int(season_data[(season_data["batter"] == batter_name) & (season_data["batsman_runs"] == 4)]["batsman_runs"].count())

        # Append results
        season_name.append(selected_season)
        season_runs_four.append(total_four)

    # Create DataFrame for results
    data = {"label": season_name, "Total Fours": season_runs_four}

    return jsonify(data)

def sixes_per_season(batter_name):
    matches_per_season = matches.groupby("season")["id"].apply(list).reset_index()

    # Store results
    season_name = []
    season_runs_six = []

    # Iterate over each season
    for index, row in matches_per_season.iterrows():
        selected_season = row["season"]
        match_ids_for_season = row["id"]  # This is already a list of match_ids

        # Filter deliveries for selected season
        season_data = deliveries[deliveries["match_id"].isin(match_ids_for_season)]
        
        # Count the number of sixes hit by the given batter
        total_sixes = int(season_data[(season_data["batter"] == batter_name) & (season_data["batsman_runs"] == 6)]["batsman_runs"].count())

        # Append results
        season_name.append(selected_season)
        season_runs_six.append(total_sixes)

    # Create DataFrame for results
    data = {"label": season_name, "Total Sixes": season_runs_six}

    return jsonify(data)

def batter_dismissal_types(batter_name):
    dismissals = deliveries[deliveries["player_dismissed"] == batter_name]["dismissal_kind"].value_counts()

    data = {
        "Dismissal Type": dismissals.index.tolist(),  # Convert Index to list
        "Dismissal Count": dismissals.values.tolist()  # Convert int64 to Python int
    }

    return jsonify(data)

def avg_strike_rate_per_season(batter_name):
    season_name = []
    batting_avg = []
    Strike_Rate = []


    matches_per_season = matches.groupby("season")["id"].apply(list).reset_index()

    # Create DataFrame with season and match IDs
    season_match_ids = pd.DataFrame({
        "season": matches_per_season["season"],
        "match_ids": matches_per_season["id"]
    })

    # Iterate over each season
    for selected_season in season_match_ids["season"]:
        
        season_name.append(selected_season)
        
        # Get match IDs for the selected season
        match_ids_for_season = season_match_ids.loc[season_match_ids["season"] == selected_season, "match_ids"].iloc[0]
        
        # Filter deliveries dataset for the selected season
        season_data = deliveries[deliveries["match_id"].isin(match_ids_for_season)]

        # Total Dismissals (count of player_dismissed occurrences)
        total_dismissals = season_data[season_data["player_dismissed"] == batter_name].shape[0]
        
        # Get total runs for the batter
        total_runs = season_data[season_data["batter"] == batter_name]["batsman_runs"].sum().item()

        # Batting Average  If a player is never dismissed, the average is set to infinity.
        batting_average = f"{total_runs / total_dismissals:.2f}" if total_dismissals > 0 else 0
        
        batting_avg.append(batting_average)

        # Filter deliveries where the player is the batter
        player_data = season_data[season_data["batter"] == batter_name]

        # Total Balls Faced
        total_balls_faced = player_data.shape[0]

        # Strike Rate Formula
        strike_rate = f"{(total_runs / total_balls_faced) * 100:.2f}" if total_balls_faced > 0 else 0

        Strike_Rate.append(strike_rate)

    data = {
        "label":season_name,"battingAvg":batting_avg,"strikeRate":Strike_Rate
    }
    
    return jsonify(data)


def half_centuries_and_centuries_per_season(batter_name):
    season_name = []
    half_centuries = []
    full_centuries = []

    # Group match IDs by season
    matches_per_season = matches.groupby("season")["id"].apply(list).reset_index()

    # Create DataFrame with season and match IDs
    season_match_ids = pd.DataFrame({
        "season": matches_per_season["season"],
        "match_ids": matches_per_season["id"]
    })

    for selected_season in season_match_ids["season"]:

        season_name.append(selected_season)

        # Get match IDs for the selected season
        match_ids_for_season = season_match_ids.loc[season_match_ids["season"] == selected_season, "match_ids"].values[0]  

        half_centuries_count = 0
        full_centuries_count = 0
        for match_id in match_ids_for_season:

            # Filter deliveries dataset for the selected match
            season_data = deliveries[deliveries["match_id"] == match_id]

            # Get total runs for the batter in that match
            total_runs = season_data[season_data["batter"] == batter_name]["batsman_runs"].sum()

            if 50 <= total_runs < 100:
                half_centuries_count += 1
            elif total_runs >= 100:
                full_centuries_count += 1

        half_centuries.append(half_centuries_count)
        full_centuries.append(full_centuries_count)

    # Create final DataFrame
    data = {
        "label": season_name,
        "Half Centuries": half_centuries,
        "Centuries": full_centuries
    }

    return jsonify(data)

def most_dismissed_by_bowler(batter_name):
    bowler_dismissals = ["caught", "bowled", "lbw", "caught and bowled", "stumped", "hit wicket"]

    dismissals = deliveries[deliveries["player_dismissed"] == batter_name]
    bowlers = dismissals[dismissals["dismissal_kind"].isin(bowler_dismissals)].value_counts("bowler").sort_values(ascending=False).head(10)

    data = {
        "label" : bowlers.index.tolist(),
        "Wicket Count" : bowlers.values.tolist()
    }

    return jsonify(data)