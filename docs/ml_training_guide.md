# Machine Learning Training Guide for AGRIWEB

This guide outlines the theoretical approach and practical implementation steps to build the two core ML models for the AGRIWEB platform: the **Price Predictor** and the **Quality Grader**.

---

## 1. Price Predictor Model

### Purpose
To predict the optimal asking price and expected mandi price for a specific commodity in a specific region, enabling farmers to set competitive rates.

### Data Requirements
- **Sources:** 
  - **Agmarknet:** Daily wholesale prices (mandi rates) for various commodities across Indian states.
  - **OpenWeatherMap/IMD:** Historical weather data (rainfall, temperature) as agricultural yields heavily depend on weather.
  - **Kaggle Datasets:** Indian agriculture crop production and pricing datasets.
- **Size:** Minimum 5-10 years of daily/weekly historical price data per commodity per region (approx. 100,000 to 500,000 rows).
- **Features (Inputs):** `Commodity`, `Variety`, `State`, `District`, `Date/Season`, `Rainfall`, `Temperature`.
- **Target (Output):** `Price_Per_Kg`.

### Model Architecture
- **Time-Series Forecasting:** 
  - **LSTM (Long Short-Term Memory):** Best for capturing seasonal trends over time.
  - **XGBoost / Random Forest Regressor:** Excellent for tabular data regression when factoring in multiple categorical variables (State, Commodity).

### Training Sketch (Python / Scikit-Learn)
```python
import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split

# 1. Load Data
df = pd.read_csv("agmarknet_historical_prices.csv")

# 2. Preprocess (One-hot encode categorical features)
X = pd.get_dummies(df[['commodity', 'state', 'season', 'rainfall']])
y = df['price_per_kg']

# 3. Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = XGBRegressor(n_estimators=100, learning_rate=0.1)
model.fit(X_train, y_train)

# 4. Save Model
import joblib
joblib.dump(model, 'price_predictor.pkl')
```

---

## 2. Quality Grader Model

### Purpose
To automatically classify the quality grade (Grade A, B, or C) of a commodity based on an uploaded image, preventing manual misrepresentation of produce quality.

### Data Requirements
- **Sources:**
  - **PlantVillage Dataset:** Open-source dataset of healthy and diseased leaves/crops.
  - **Custom Scraped Images:** Images of Grade A (fresh, unblemished), Grade B (minor blemishes, size variance), and Grade C (damaged, rotting) commodities.
- **Size:** Minimum 5,000 to 10,000 labeled images per commodity for robust accuracy. Data augmentation (rotation, flipping, contrast adjustment) should be used.

### Model Architecture
- **Convolutional Neural Networks (CNN):**
  - **Transfer Learning (ResNet50 or MobileNetV2):** Using a pre-trained model on ImageNet and fine-tuning the last layers for our specific Grade A/B/C classification. MobileNetV2 is preferred for fast inference on servers/mobile devices.

### Training Sketch (TensorFlow / Keras)
```python
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# 1. Load Pre-trained Base
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False # Freeze base layers

# 2. Add Custom Classification Head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(3, activation='softmax')(x) # 3 Classes: A, B, C

model = Model(inputs=base_model.input, outputs=predictions)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 3. Train Model
# (Assuming `train_dataset` is a tf.data.Dataset of images)
# model.fit(train_dataset, epochs=10)

# 4. Save Model
model.save('quality_grader.h5')
```

---

### Deployment Strategy
1. **API Integration:** Serve these models via Flask/FastAPI in `backend/ml/`.
2. **Inference:** 
   - When a farmer types in details in the Add Product modal, an API call fetches the predicted price.
   - When an image is uploaded, it is passed through the CNN to automatically suggest the Grade.
