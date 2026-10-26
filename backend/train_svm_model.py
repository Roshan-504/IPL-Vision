"""
Train and Save Ball-by-Ball SVM Match Win Prediction Model for IPL Vision
========================================================================
This script processes historical IPL ball-by-ball delivery data to train
a Calibrated Support Vector Machine (SVM) pipeline that predicts real-time
win probabilities for chasing vs defending teams.

Features used:
- batting_team (chasing team)
- bowling_team (defending team)
- city / venue
- runs_left (target_runs - current_score)
- balls_left (120 - balls_bowled)
- wickets_left (10 - wickets_fallen)
- target_runs (1st innings total + 1)
- crr (current run rate)
- rrr (required run rate)
"""

import os
import sys
import pickle
import time
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, brier_score_loss

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from data_loader import deliveries, matches

# Top active franchise teams in modern IPL
ACTIVE_TEAMS = [
    'Chennai Super Kings',
    'Delhi Capitals',
    'Gujarat Titans',
    'Kolkata Knight Riders',
    'Lucknow Super Giants',
    'Mumbai Indians',
    'Punjab Kings',
    'Rajasthan Royals',
    'Royal Challengers Bengaluru',
    'Sunrisers Hyderabad'
]


def prepare_dataset():
    print("--> Preparing ball-by-ball chase dataset from IPL deliveries & matches...")
    
    # 1. Calculate Target Runs from 1st Innings (total runs + 1)
    first_innings = deliveries[deliveries['inning'] == 1].groupby('match_id')['total_runs'].sum().reset_index()
    first_innings['calc_target'] = first_innings['total_runs'] + 1
    
    # Merge target score into matches metadata
    match_df = matches.merge(first_innings[['match_id', 'calc_target']], left_on='id', right_on='match_id')
    match_df['target_runs'] = match_df['target_runs'].fillna(match_df['calc_target'])
    
    # 2. Extract 2nd Innings (chasing team) deliveries
    second_innings = deliveries[deliveries['inning'] == 2].copy()
    chase_df = match_df.merge(second_innings, on='match_id')
    
    # Filter for active IPL teams
    filtered_df = chase_df[
        chase_df['batting_team'].isin(ACTIVE_TEAMS) & 
        chase_df['bowling_team'].isin(ACTIVE_TEAMS)
    ].copy()
    
    # 3. Ball-by-ball feature engineering
    # Cumulative runs in the chase
    filtered_df['current_score'] = filtered_df.groupby('match_id')['total_runs'].cumsum()
    filtered_df['runs_left'] = filtered_df['target_runs'] - filtered_df['current_score']
    
    # Balls bowled and balls remaining (T20 max = 120 balls)
    filtered_df['balls_bowled'] = filtered_df['over'] * 6 + filtered_df['ball']
    filtered_df['balls_left'] = (120 - filtered_df['balls_bowled']).clip(lower=0)
    
    # Cumulative wickets lost and remaining
    filtered_df['wickets_fallen'] = filtered_df.groupby('match_id')['is_wicket'].cumsum()
    filtered_df['wickets_left'] = 10 - filtered_df['wickets_fallen']
    
    # Filter valid chase states (balls remaining > 0, non-negative target)
    valid_df = filtered_df[(filtered_df['balls_left'] > 0) & (filtered_df['runs_left'] >= 0)].copy()
    
    # Current Run Rate (CRR) & Required Run Rate (RRR)
    valid_df['crr'] = (valid_df['current_score'] * 6) / valid_df['balls_bowled']
    valid_df['rrr'] = (valid_df['runs_left'] * 6) / valid_df['balls_left']
    
    # Target label: 1 if chasing (batting) team won, 0 otherwise
    valid_df['result'] = (valid_df['winner'] == valid_df['batting_team']).astype(int)
    
    # Fill missing cities using venue
    valid_df['city'] = valid_df['city'].fillna(
        valid_df['venue'].apply(lambda v: str(v).split(',')[0].strip())
    )
    
    features = [
        'batting_team', 'bowling_team', 'city',
        'runs_left', 'balls_left', 'wickets_left', 'target_runs', 'crr', 'rrr'
    ]
    
    X = valid_df[features]
    y = valid_df['result']
    
    print(f"--> Dataset ready with {len(X):,} ball-by-ball game states across {valid_df['match_id'].nunique()} matches.")
    return X, y, valid_df['city'].unique().tolist()


def train_and_save_model(model_dir="models", model_filename="win_predictor_svm.pkl"):
    X, y, cities = prepare_dataset()
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Define ColumnTransformer (OneHotEncoder for categorical, StandardScaler for numerical)
    categorical_cols = ['batting_team', 'bowling_team', 'city']
    numeric_cols = ['runs_left', 'balls_left', 'wickets_left', 'target_runs', 'crr', 'rrr']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), categorical_cols),
            ('num', StandardScaler(), numeric_cols)
        ]
    )
    
    # Support Vector Classifier with Platt Probability Calibration
    # LinearSVC scales efficiently O(N) over 80,000+ ball states
    # CalibratedClassifierCV calibrates SVM margins into accurate win probabilities
    base_svm = LinearSVC(dual=False, random_state=42, max_iter=2500)
    calibrated_svm = CalibratedClassifierCV(estimator=base_svm, cv=3)
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', calibrated_svm)
    ])
    
    print("--> Training Calibrated SVM Pipeline...")
    t0 = time.time()
    pipeline.fit(X_train, y_train)
    duration = time.time() - t0
    print(f"--> Training completed in {duration:.2f} seconds.")
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    brier = brier_score_loss(y_test, y_prob)
    print(f"--> Test Accuracy: {acc * 100:.2f}%")
    print(f"--> Probability Brier Score: {brier:.4f} (lower is better, 0 is perfect)")
    print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=['Defending Team Wins', 'Chasing Team Wins']))
    
    # Save Pipeline and metadata
    os.makedirs(os.path.join(BASE_DIR, model_dir), exist_ok=True)
    model_path = os.path.join(BASE_DIR, model_dir, model_filename)
    
    artifact = {
        'pipeline': pipeline,
        'teams': sorted(ACTIVE_TEAMS),
        'cities': sorted([c for c in cities if pd.notna(c) and str(c).strip() != '']),
        'features': ['batting_team', 'bowling_team', 'city', 'runs_left', 'balls_left', 'wickets_left', 'target_runs', 'crr', 'rrr'],
        'model_type': 'Calibrated Linear SVM (Support Vector Machine)',
        'accuracy': acc
    }
    
    with open(model_path, 'wb') as f:
        pickle.dump(artifact, f)
        
    print(f"--> Model successfully saved to {model_path}!")
    
    # Quick Test Demonstration
    demo_sample = pd.DataFrame([{
        'batting_team': 'Royal Challengers Bengaluru',
        'bowling_team': 'Chennai Super Kings',
        'city': 'Bangalore',
        'runs_left': 42,
        'balls_left': 24,
        'wickets_left': 6,
        'target_runs': 185,
        'crr': 8.94,
        'rrr': 10.5
    }])
    
    prob = pipeline.predict_proba(demo_sample)[0]
    print("\n=== Live Sample Prediction Demo ===")
    print(f"Match Situation: RCB chasing 185 vs CSK in Bangalore")
    print(f"Need: 42 runs from 24 balls with 6 wickets in hand")
    print(f"-> RCB (Batting Team) Win Probability: {prob[1]*100:.1f}%")
    print(f"-> CSK (Bowling Team) Win Probability: {prob[0]*100:.1f}%\n")


if __name__ == "__main__":
    train_and_save_model()
