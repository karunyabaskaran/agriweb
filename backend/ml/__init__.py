from backend.ml.price_predictor import PricePredictor
from backend.ml.quality_grader import QualityGrader
from backend.ml.demand_forecaster import DemandForecaster

price_predictor = PricePredictor()
quality_grader = QualityGrader()
demand_forecaster = DemandForecaster()

__all__ = ["price_predictor", "quality_grader", "demand_forecaster"]
