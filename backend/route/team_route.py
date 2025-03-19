from flask import Blueprint
import controllers.team_controller as team_controller

team_bp = Blueprint("team_routes", __name__)

team_bp.route("/get-total-teams",methods = ['GET'])()