from flask import Flask, request, jsonify
import json
from predict import *


app = Flask(__name__)
@app.route('/')
def index():
    return json.dumps({"message": "test"})

@app.route('/predict', methods=['POST'])
def api_predict():
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

app.run()