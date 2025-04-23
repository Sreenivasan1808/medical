import os
import pandas as pd
from joblib import load
from sklearn.preprocessing import MinMaxScaler

def predict(features):
    base_folder = r"./ml_models"
    best_model_file = os.path.join(base_folder, "BestModel.joblib")
    top_features_file = os.path.join(base_folder, "top_10_features.txt")
    training_csv_path = os.path.join(base_folder, "pd_speech_features.csv")

   
    with open(top_features_file, 'r') as f:
        top_features = [line.strip() for line in f if line.strip() != ""]
    # print("Top Features:", top_features)

    X_sample = features[top_features]

    training_data = pd.read_csv(training_csv_path)
    X_training = training_data[top_features]
    
    # Fit the Min-Max Scaler on the training data features
    scaler = MinMaxScaler()
    scaler.fit(X_training)


    X_sample_normalized = scaler.transform(X_sample)

    model = load(best_model_file)
    predictions = model.predict(X_sample_normalized)

    print("Predictions: ", predictions)

    return predictions[0]
