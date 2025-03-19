import pandas as pd
import numpy as np
from flask import jsonify

deliveries = pd.read_csv("./datasets/deliveries.csv")
matches = pd.read_csv("./datasets/matches.csv")
team = pd.read_csv("./datasets/teams_info.csv")

def get_total_teams():
    