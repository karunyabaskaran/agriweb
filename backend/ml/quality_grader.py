import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

class QualityGrader:
    """
    AI/ML Produce Quality & Freshness Assessment Model.
    Predicts agricultural grade (Grade A / Grade B / Grade C),
    freshness score (0-100), and remaining shelf life based on harvest metrics.
    """
    def __init__(self):
        self.pipeline = None
        self.commodities = ["Tomato", "Onion", "Potato", "Wheat", "Rice", "Banana", "Brinjal", "Cauliflower", "Green Chilli"]
        self.storage_types = ["Ambient", "Ventilated Crate", "Cold Storage"]
        self._train_model()

    def _generate_synthetic_quality_data(self):
        np.random.seed(42)
        X_rows = []
        y_grades = []

        for commodity in self.commodities:
            for storage in self.storage_types:
                for harvest_days in range(1, 21):
                    for blemish_pct in [2, 8, 15, 25, 40]:
                        for moisture_pct in [60, 75, 85, 95]:
                            for uniformity_pct in [60, 75, 90]:
                                # Scoring logic based on AGMARK / FSSAI standards
                                score = 100
                                # harvest age penalty
                                if storage == "Cold Storage":
                                    score -= harvest_days * 1.5
                                elif storage == "Ventilated Crate":
                                    score -= harvest_days * 3.0
                                else: # Ambient
                                    score -= harvest_days * 5.0

                                # Blemish penalty
                                score -= blemish_pct * 1.2
                                # Moisture and uniformity bonuses
                                score += (moisture_pct - 70) * 0.3
                                score += (uniformity_pct - 70) * 0.3

                                if score >= 78:
                                    grade = "A"
                                elif score >= 55:
                                    grade = "B"
                                else:
                                    grade = "C"

                                X_rows.append([commodity, storage, harvest_days, blemish_pct, moisture_pct, uniformity_pct])
                                y_grades.append(grade)

        return X_rows, y_grades

    def _train_model(self):
        X, y = self._generate_synthetic_quality_data()

        preprocessor = ColumnTransformer(
            transformers=[
                ("cat", OneHotEncoder(handle_unknown="ignore"), [0, 1])
            ],
            remainder="passthrough"
        )

        self.pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1))
        ])

        self.pipeline.fit(X, y)
        print("AI/ML Quality Grading model trained successfully.")

    def grade_produce(self, commodity="Tomato", storage_type="Ventilated Crate", days_since_harvest=2,
                      blemish_percent=5, moisture_percent=85, size_uniformity_percent=90):
        """
        Grades produce and returns Grade (A/B/C), freshness score (0-100),
        estimated remaining shelf life, and price modifier.
        """
        if not self.pipeline:
            self._train_model()

        comm_title = commodity.strip().title() if commodity else "Tomato"
        storage_title = storage_type.strip().title() if storage_type else "Ventilated Crate"

        features = [[
            comm_title,
            storage_title,
            int(days_since_harvest),
            float(blemish_percent),
            float(moisture_percent),
            float(size_uniformity_percent)
        ]]

        predicted_grade = self.pipeline.predict(features)[0]

        # Calculate Freshness Score
        base_scores = {"A": 92, "B": 74, "C": 52}
        freshness_score = base_scores.get(predicted_grade, 70)
        freshness_score -= (int(days_since_harvest) * 2) + (float(blemish_percent) * 0.4)
        freshness_score = max(20, min(100, round(freshness_score, 1)))

        # Remaining shelf life
        max_shelf_life = {
            "Tomato": 10, "Banana": 7, "Brinjal": 8, "Cauliflower": 9,
            "Green Chilli": 12, "Onion": 60, "Potato": 45, "Wheat": 365, "Rice": 365
        }
        max_days = max_shelf_life.get(comm_title, 14)
        storage_mult = 1.6 if storage_title == "Cold Storage" else (1.1 if storage_title == "Ventilated Crate" else 0.8)
        remaining_days = max(1, round((max_days - int(days_since_harvest)) * storage_mult * (freshness_score / 100)))

        # Price multiplier
        multipliers = {
            "A": 1.15, # 15% premium for export/supermarket grade
            "B": 1.00, # Standard fair market value
            "C": 0.82  # Discounted processing grade
        }
        price_multiplier = multipliers.get(predicted_grade, 1.00)

        # Grade criteria description
        descriptions = {
            "A": "Grade A (Premium / Supermarket Grade) — Optimal firmness, high uniformity (<5% blemish), eligible for premium buyer contracts.",
            "B": "Grade B (Standard Market Grade) — Good commercial quality, minor cosmetic blemishes, standard retail ready.",
            "C": "Grade C (Processing Grade) — Suitable for sauces, purees, milling or bulk processing."
        }

        return {
            "commodity": comm_title,
            "predictedGrade": predicted_grade,
            "freshnessScore": freshness_score,
            "estimatedShelfLifeDays": remaining_days,
            "priceMultiplier": price_multiplier,
            "description": descriptions.get(predicted_grade, ""),
            "storageCondition": storage_title,
            "daysSinceHarvest": int(days_since_harvest)
        }
