from flask import Blueprint
import controllers.bowler_controller as bowler_controller

bowler_bp = Blueprint('bowler_routes', __name__)

# Define routes using Blueprint syntax
bowler_bp.route("/get-total-bowler", methods=["GET"])(bowler_controller.get_total_bowler)
bowler_bp.route("/get-bowler-info/<bowler_name>", methods=["GET"])(bowler_controller.get_bowler_info)
bowler_bp.route("/get-bowler-dismissal-kind/<bowler_name>", methods=["GET"])(bowler_controller.bowler_dismissal_kind)
