import pandas as pd
import numpy as np

deliveries = pd.read_csv("./datasets/deliveries.csv")
matches = pd.read_csv("./datasets/matches.csv")

def get_total_players():
    batters = deliveries["batter"].unique()
    strikers = deliveries["non_striker"].unique()

    # Compute the union using set operations (fastest)
    total_platers = set(batters) | set(strikers)
    total_platers = list(total_platers)
    total_platers.sort()

    return total_platers

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

    return data

    
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
        'seasonName': season_name,
        'seasonRuns': season_runs
    }
    return data


