from flask import Flask, request, jsonify
import json
from predict import *
import pickle
import numpy as np

with open("./ml_models/diabetes_prediction_model.pkl", "rb") as file:
    model = pickle.load(file)

app = Flask(__name__)
@app.route('/')
def index():
    return json.dumps({"message": "test"})

@app.route('/predict/parkinson', methods=['POST'])
def parkinson_predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read CSV file into DataFrame
        df = pd.read_csv(file)
        print(df.iloc[:,:5])
        # Call predict function
        result = int(predict(df))
        # Return prediction result
        print("Result: ", result)
        return jsonify({"result": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Define a route for making predictions
@app.route("/predict/diabetes", methods=["POST"])
def diabetes_predict():
    # Get input data from the form
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    print("File arrived")
    try:
        # Read CSV file into DataFrame
        df = pd.read_csv(file).iloc[0]
        print(df)
        pregnancies = float(df["Pregnancies"])
        glucose = float(df["Glucose"])
        blood_pressure = float(df["BloodPressure"])
        skin_thickness = float(df["SkinThickness"])
        insulin = float(df["Insulin"])
        bmi = float(df["BMI"])
        diabetes_pedigree_function = float(df["DiabetesPedigreeFunction"])
        age = float(df["Age"])
        outcome = df["Outcome"]

        # Combine inputs into a single list
        input_data = np.asarray([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age]])

        # Make a prediction using the model
        prediction = model.predict(input_data)
        print(f"Prediction: {prediction}")
        print(f"Actual: {outcome}")

        # Determine the output message
        if outcome == 0:
            prediction_text = 'Not diabetic'
        else:
            prediction_text = 'Diabetic'
        
        return jsonify({"result": prediction_text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


app.run()