from flask import Blueprint
import controllers.bowler_controller as bowler_controller

bowler_bp = Blueprint('bowler_routes', __name__)

# Core Info & List
bowler_bp.route("/get-total-bowler", methods=["GET"])(bowler_controller.get_total_bowler)
bowler_bp.route("/get-bowler-info/<bowler_name>", methods=["GET"])(bowler_controller.get_bowler_info)

# Season Analysis
bowler_bp.route("/get-bowler-season-vs-wickets/<bowler_name>", methods=["GET"])(bowler_controller.season_vs_wickets)
bowler_bp.route("/get-bowler-season-performance/<bowler_name>", methods=["GET"])(bowler_controller.season_performance)

# Phase & Matchup Analysis
bowler_bp.route("/get-bowler-phase-analysis/<bowler_name>", methods=["GET"])(bowler_controller.bowler_phase_analysis)
bowler_bp.route("/get-bowler-top-dismissed-batters/<bowler_name>", methods=["GET"])(bowler_controller.bowler_top_dismissed_batters)
bowler_bp.route("/get-bowler-wickets-vs-teams/<bowler_name>", methods=["GET"])(bowler_controller.bowler_wickets_vs_teams)
bowler_bp.route("/get-bowler-dismissal-kind/<bowler_name>", methods=["GET"])(bowler_controller.bowler_dismissal_kind)
