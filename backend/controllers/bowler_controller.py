import pandas as pd
import numpy as np
from flask import jsonify
from data_loader import deliveries, matches

VALID_DISMISSALS = ["bowled", "caught", "lbw", "stumped", "hit wicket", "caught and bowled"]


def get_total_bowler():
    bowlers = deliveries["bowler"].unique()
    total_bowler = list(set(bowlers))
    total_bowler.sort()
    return jsonify({"data": total_bowler})


def get_bowler_info(bowler_name):
    b_del = deliveries[deliveries["bowler"] == bowler_name]

    if b_del.empty:
        return jsonify({
            "TotalWickets": 0,
            "DotBallPercentage": 0,
            "BowlingStrikeRate": 0,
            "EconomyRate": 0,
            "BowlingAverage": 0,
            "TotalMatches": 0,
            "TotalOvers": "0.0",
            "BestBowling": "0/0",
            "FourWicketHauls": 0,
            "MaidenOvers": 0,
            "TotalSeasons": 0
        })

    # Total matches played/bowled
    total_matches = int(b_del["match_id"].nunique())

    # Total wickets taken (valid dismissals only)
    wkt_filter = (
        (b_del["is_wicket"] == 1) &
        (b_del["dismissal_kind"].notna()) &
        (b_del["dismissal_kind"].isin(VALID_DISMISSALS))
    )
    total_wickets = int(b_del[wkt_filter].shape[0])

    # Total Runs Conceded (Excluding Byes & Leg-Byes)
    not_byes = ~b_del["extras_type"].fillna("").isin(["byes", "legbyes"])
    runs_conceded = int(b_del[not_byes]["total_runs"].sum())

    # Legal Deliveries (Excluding Wides & No-Balls)
    legal_mask = ~b_del["extras_type"].fillna("").isin(["wides", "noballs"])
    legal_deliveries = int(legal_mask.sum())

    # Calculate Overs Bowled Properly
    complete_overs = legal_deliveries // 6
    remaining_balls = legal_deliveries % 6
    overs_bowled = complete_overs + (remaining_balls / 6)
    total_overs_str = f"{complete_overs}.{remaining_balls}"

    # Calculate Rates
    economy_rate = round(runs_conceded / overs_bowled, 2) if overs_bowled > 0 else 0
    bowling_strike_rate = round(legal_deliveries / total_wickets, 2) if total_wickets > 0 else 0
    bowling_avg = round(runs_conceded / total_wickets, 2) if total_wickets > 0 else 0

    # Count Dot Balls
    dot_balls = int(b_del[(b_del["total_runs"] == 0) & legal_mask].shape[0])
    dot_ball_percentage = round((dot_balls / legal_deliveries) * 100, 2) if legal_deliveries > 0 else 0

    # Best Bowling in an Inning & 4+ Wicket Hauls
    b_del_copy = b_del.copy()
    b_del_copy["bowler_runs"] = b_del_copy["total_runs"].where(not_byes, 0)
    b_del_copy["is_valid_wicket"] = wkt_filter.astype(int)

    match_agg = b_del_copy.groupby("match_id").agg(
        wickets=("is_valid_wicket", "sum"),
        runs=("bowler_runs", "sum")
    ).reset_index()

    four_wkt_hauls = int((match_agg["wickets"] >= 4).sum())
    if not match_agg.empty:
        best_row = match_agg.sort_values(by=["wickets", "runs"], ascending=[False, True]).iloc[0]
        best_bowling_str = f"{int(best_row['wickets'])}/{int(best_row['runs'])}"
    else:
        best_bowling_str = "0/0"

    # Vectorized Maiden Overs
    b_del_copy["is_legal"] = legal_mask.astype(int)
    over_agg = b_del_copy.groupby(["match_id", "inning", "over"]).agg(
        legal_balls=("is_legal", "sum"),
        runs=("bowler_runs", "sum")
    )
    maidens = int(((over_agg["legal_balls"] >= 6) & (over_agg["runs"] == 0)).sum())

    # Total Seasons Bowled
    b_merged = b_del.merge(matches[["id", "season"]], left_on="match_id", right_on="id", how="inner")
    total_seasons = int(b_merged["season"].nunique())

    data = {
        "TotalWickets": total_wickets,
        "DotBallPercentage": dot_ball_percentage,
        "BowlingStrikeRate": bowling_strike_rate,
        "EconomyRate": economy_rate,
        "BowlingAverage": bowling_avg,
        "TotalMatches": total_matches,
        "TotalOvers": total_overs_str,
        "BestBowling": best_bowling_str,
        "FourWicketHauls": four_wkt_hauls,
        "MaidenOvers": maidens,
        "TotalSeasons": total_seasons
    }

    return jsonify(data)


def season_vs_wickets(bowler_name):
    """Season-wise wickets breakdown for bowler"""
    b_del = deliveries[deliveries["bowler"] == bowler_name]
    if b_del.empty:
        return jsonify({"label": [], "Wickets Per Season": []})

    b_merged = b_del.merge(matches[["id", "season"]], left_on="match_id", right_on="id", how="inner")
    all_seasons = sorted(b_merged["season"].unique())

    wkt_filter = (
        (b_merged["is_wicket"] == 1) &
        (b_merged["dismissal_kind"].notna()) &
        (b_merged["dismissal_kind"].isin(VALID_DISMISSALS))
    )
    wkts_series = b_merged[wkt_filter].groupby("season")["is_wicket"].sum().reindex(all_seasons, fill_value=0)

    data = {
        "label": [str(s) for s in wkts_series.index.tolist()],
        "Wickets Per Season": [int(x) for x in wkts_series.values.tolist()]
    }
    return jsonify(data)


def season_performance(bowler_name):
    """Season-wise Economy Rate and Bowling Average trends"""
    b_del = deliveries[deliveries["bowler"] == bowler_name]
    if b_del.empty:
        return jsonify({"label": [], "Economy Rate": [], "Bowling Average": []})

    b_merged = b_del.merge(matches[["id", "season"]], left_on="match_id", right_on="id", how="inner")
    all_seasons = sorted(b_merged["season"].unique())

    b_merged["runs"] = b_merged["total_runs"].where(~b_merged["extras_type"].fillna("").isin(["byes", "legbyes"]), 0)
    b_merged["is_legal"] = (~b_merged["extras_type"].fillna("").isin(["wides", "noballs"])).astype(int)
    b_merged["is_wkt"] = (
        (b_merged["is_wicket"] == 1) &
        (b_merged["dismissal_kind"].notna()) &
        (b_merged["dismissal_kind"].isin(VALID_DISMISSALS))
    ).astype(int)

    season_agg = b_merged.groupby("season")[["runs", "is_legal", "is_wkt"]].sum().reindex(all_seasons, fill_value=0)
    overs = season_agg["is_legal"] // 6 + (season_agg["is_legal"] % 6) / 6
    economy = (season_agg["runs"] / overs).where(overs > 0, 0).round(2)
    average = (season_agg["runs"] / season_agg["is_wkt"]).where(season_agg["is_wkt"] > 0, 0).round(2)

    data = {
        "label": [str(s) for s in all_seasons],
        "Economy Rate": economy.tolist(),
        "Bowling Average": average.tolist()
    }
    return jsonify(data)


def bowler_phase_analysis(bowler_name):
    """Performance breakdown by phase: Powerplay (1-6), Middle (7-15), Death (16-20)"""
    b_del = deliveries[deliveries["bowler"] == bowler_name].copy()
    phases = ["Powerplay (Overs 1-6)", "Middle (Overs 7-15)", "Death (Overs 16-20)"]
    if b_del.empty:
        return jsonify({"label": phases, "Wickets": [0, 0, 0], "Economy Rate": [0, 0, 0]})

    b_del["phase"] = b_del["over"].apply(
        lambda o: "Powerplay (Overs 1-6)" if o < 6 else ("Middle (Overs 7-15)" if o < 15 else "Death (Overs 16-20)")
    )
    b_del["runs"] = b_del["total_runs"].where(~b_del["extras_type"].fillna("").isin(["byes", "legbyes"]), 0)
    b_del["is_legal"] = (~b_del["extras_type"].fillna("").isin(["wides", "noballs"])).astype(int)
    b_del["is_wkt"] = (
        (b_del["is_wicket"] == 1) &
        (b_del["dismissal_kind"].notna()) &
        (b_del["dismissal_kind"].isin(VALID_DISMISSALS))
    ).astype(int)

    p_agg = b_del.groupby("phase")[["runs", "is_legal", "is_wkt"]].sum().reindex(phases, fill_value=0)
    overs = p_agg["is_legal"] // 6 + (p_agg["is_legal"] % 6) / 6
    economy = (p_agg["runs"] / overs).where(overs > 0, 0).round(2)

    data = {
        "label": phases,
        "Wickets": [int(x) for x in p_agg["is_wkt"].tolist()],
        "Economy Rate": economy.tolist()
    }
    return jsonify(data)


def bowler_top_dismissed_batters(bowler_name):
    """Top 10 most frequently dismissed batters by this bowler"""
    b_del = deliveries[deliveries["bowler"] == bowler_name]
    if b_del.empty:
        return jsonify({"label": [], "Wickets": []})

    wkt_filter = (
        (b_del["is_wicket"] == 1) &
        (b_del["dismissal_kind"].notna()) &
        (b_del["dismissal_kind"].isin(VALID_DISMISSALS))
    )
    top_batters = b_del[wkt_filter]["player_dismissed"].value_counts().head(10)

    data = {
        "label": top_batters.index.tolist(),
        "Wickets": [int(x) for x in top_batters.values.tolist()]
    }
    return jsonify(data)


def bowler_wickets_vs_teams(bowler_name):
    """Wickets taken against each opposition franchise"""
    b_del = deliveries[deliveries["bowler"] == bowler_name]
    if b_del.empty:
        return jsonify({"label": [], "Wickets": []})

    wkt_filter = (
        (b_del["is_wicket"] == 1) &
        (b_del["dismissal_kind"].notna()) &
        (b_del["dismissal_kind"].isin(VALID_DISMISSALS))
    )
    team_wkts = b_del[wkt_filter]["batting_team"].value_counts().head(10)

    data = {
        "label": team_wkts.index.tolist(),
        "Wickets": [int(x) for x in team_wkts.values.tolist()]
    }
    return jsonify(data)


def bowler_dismissal_kind(bowler_name):
    """Distribution of dismissal types (Bowled, Caught, LBW, etc.)"""
    b_del = deliveries[deliveries["bowler"] == bowler_name]
    if b_del.empty:
        return jsonify({
            "Dismissal Type": VALID_DISMISSALS,
            "Dismissal Count": [0] * len(VALID_DISMISSALS)
        })

    wkt_filter = (
        (b_del["is_wicket"] == 1) &
        (b_del["dismissal_kind"].notna()) &
        (b_del["dismissal_kind"].isin(VALID_DISMISSALS))
    )
    counts = b_del[wkt_filter]["dismissal_kind"].value_counts().reindex(VALID_DISMISSALS, fill_value=0)

    data = {
        "Dismissal Type": counts.index.tolist(),
        "Dismissal Count": [int(x) for x in counts.values.tolist()]
    }
    return jsonify(data)