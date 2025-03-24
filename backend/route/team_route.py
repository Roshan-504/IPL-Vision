from flask import Blueprint
import controllers.team_controller as team_controller

team_bp = Blueprint("team_routes", __name__)

team_bp.route("/get-total-teams",methods = ['GET'])(team_controller.get_total_teams)
team_bp.route("/get-team-info/<team_name>",methods = ['GET'])(team_controller.get_team_info)
team_bp.route("/get-top-batters/<team_name>",methods = ['GET'])(team_controller.get_top_batters)
team_bp.route("/get-top-bowlers/<team_name>",methods = ['GET'])(team_controller.get_top_bowlers)