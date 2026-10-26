import os
import sys
import pandas as pd

# Ensure backend root directory is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

DATASETS_DIR = os.path.join(BASE_DIR, "datasets")

DELIVERIES_PATH = os.path.join(DATASETS_DIR, "deliveries.csv")
MATCHES_PATH = os.path.join(DATASETS_DIR, "matches.csv")
TEAMS_INFO_PATH = os.path.join(DATASETS_DIR, "teams_info.csv")
PLAYER_INFO_PATH = os.path.join(DATASETS_DIR, "player_info.csv")

# Standardized team name replacements across IPL history
TEAM_NAME_REPLACEMENTS = {
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
}


class DataLoader:
    """
    Centralized dataset loader and in-memory cache for IPL Vision.
    Ensures that large CSVs like deliveries.csv (~27 MB) are parsed
    and held in memory only once across all controllers.
    """
    _instance = None
    _deliveries = None
    _matches = None
    _teams_info = None
    _player_info = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_matches(self) -> pd.DataFrame:
        if self._matches is None:
            if not os.path.exists(MATCHES_PATH):
                raise FileNotFoundError(f"Matches dataset not found at {MATCHES_PATH}")
            df = pd.read_csv(MATCHES_PATH)
            # Normalize team names in matches
            for col in ["team1", "team2", "toss_winner", "winner"]:
                if col in df.columns:
                    df[col] = df[col].replace(TEAM_NAME_REPLACEMENTS)
            self._matches = df
        return self._matches

    def get_deliveries(self) -> pd.DataFrame:
        if self._deliveries is None:
            if not os.path.exists(DELIVERIES_PATH):
                raise FileNotFoundError(f"Deliveries dataset not found at {DELIVERIES_PATH}")
            df = pd.read_csv(DELIVERIES_PATH)
            # Normalize team names in deliveries
            for col in ["batting_team", "bowling_team"]:
                if col in df.columns:
                    df[col] = df[col].replace(TEAM_NAME_REPLACEMENTS)
            self._deliveries = df
        return self._deliveries

    def get_teams_info(self) -> pd.DataFrame:
        if self._teams_info is None and os.path.exists(TEAMS_INFO_PATH):
            self._teams_info = pd.read_csv(TEAMS_INFO_PATH)
        return self._teams_info

    def get_player_info(self) -> pd.DataFrame:
        if self._player_info is None and os.path.exists(PLAYER_INFO_PATH):
            self._player_info = pd.read_csv(PLAYER_INFO_PATH)
        return self._player_info

    def reload(self):
        """Force reload datasets from disk."""
        self._deliveries = None
        self._matches = None
        self._teams_info = None
        self._player_info = None
        return self.get_deliveries(), self.get_matches()


# Global helper functions
def get_deliveries():
    return DataLoader.get_instance().get_deliveries()

def get_matches():
    return DataLoader.get_instance().get_matches()

def get_teams_info():
    return DataLoader.get_instance().get_teams_info()

def get_player_info():
    return DataLoader.get_instance().get_player_info()

# Export shared, cached singleton DataFrames for direct import
deliveries = get_deliveries()
matches = get_matches()
teams_info = get_teams_info()
player_info = get_player_info()
