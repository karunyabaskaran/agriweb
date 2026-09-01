import uuid
import math
from datetime import datetime

def new_id():
    """Generates a random UUID string."""
    return str(uuid.uuid4())

def current_iso_time():
    """Returns ISO 8601 formatted timestamp."""
    return datetime.utcnow().isoformat() + "Z"

def compute_trust_score(ratings):
    """Computes average trust score out of 5.0 with Bayesian prior."""
    if not ratings or len(ratings) == 0:
        return 4.0
    # Weighted calculation with 2 prior baseline ratings of 4.0
    prior_sum = 4.0 * 2
    prior_count = 2
    actual_sum = sum(ratings)
    actual_count = len(ratings)
    score = (prior_sum + actual_sum) / (prior_count + actual_count)
    return round(score, 2)

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates great-circle distance between two points in kilometers.
    """
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)
