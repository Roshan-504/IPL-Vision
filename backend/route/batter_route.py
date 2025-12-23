from flask import Blueprint
import controllers.batter_controller as batter_controller

batter_bp = Blueprint('batter_routes', __name__)

# Define routes using Blueprint syntax
batter_bp.route("/get-total-players", methods=["GET"])(batter_controller.get_total_players)
batter_bp.route("/get-batter-info/<batter_name>", methods=["GET"])(batter_controller.get_batter_info)
batter_bp.route("/get-season-vs-runs/<batter_name>", methods=["GET"])(batter_controller.seasons_vs_runs)
batter_bp.route("/fours-per-season/<batter_name>", methods=["GET"])(batter_controller.fours_per_season)
batter_bp.route("/sixes-per-season/<batter_name>", methods=["GET"])(batter_controller.sixes_per_season)
batter_bp.route("/batter-dismissal-types/<batter_name>", methods=["GET"])(batter_controller.batter_dismissal_types)
batter_bp.route("/avg-strike-rate-per-season/<batter_name>", methods=["GET"])(batter_controller.avg_strike_rate_per_season)
batter_bp.route("/half-centuries-and-centuries-per-season/<batter_name>", methods=["GET"])(batter_controller.half_centuries_and_centuries_per_season)
batter_bp.route("/most-dismissed-by-bowler/<batter_name>", methods=["GET"])(batter_controller.most_dismissed_by_bowler)
