from flask import Blueprint
import controllers.predictor_controller as predictor_controller

predictor_bp = Blueprint('predictor_routes', __name__)

predictor_bp.route("/get-predictor-metadata", methods=["GET"])(predictor_controller.get_predictor_metadata)
predictor_bp.route("/predict-win-probability", methods=["POST"])(predictor_controller.predict_win_probability)
