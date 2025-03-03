import pandas as pd
import numpy as np

deliveries = pd.read_csv("C:/Users/Roshan Yadav/jupyter python/IPL Vision/backend/datasets/deliveries.csv")

def get_total_players():
    batters = deliveries["batter"].unique()
    bowlers = deliveries["bowler"].unique()
    strikers = deliveries["non_striker"].unique()

    # Compute the union using set operations (fastest)
    total_platers = set(batters) | set(bowlers) | set(strikers)
    total_platers = list(total_platers)
    total_platers.sort()

    return total_platers