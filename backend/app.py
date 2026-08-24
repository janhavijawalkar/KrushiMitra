from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import requests
from dotenv import load_dotenv
import database

# Initialize SQLite Database & Tables
database.init_db()


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)

# Allow React frontend to access Flask APIs
CORS(app)


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")


# =========================================================
# LOAD CROP RECOMMENDATION MODEL
# =========================================================

recommendation_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "crop_recommendation_rf.pkl"
    )
)


recommendation_features = joblib.load(
    os.path.join(
        MODEL_DIR,
        "crop_recommendation_features.pkl"
    )
)


# =========================================================
# LOAD PRODUCTIVITY MODEL
# =========================================================

productivity_model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "productivity_random_forest.pkl"
    )
)


productivity_features = joblib.load(
    os.path.join(
        MODEL_DIR,
        "productivity_feature_columns.pkl"
    )
)


# =========================================================
# STARTUP INFORMATION
# =========================================================

print("======================================")
print("KrushiMitra ML Backend")
print("======================================")

print("Recommendation model loaded")
print("Productivity model loaded")

print(
    "Recommendation features:",
    len(recommendation_features)
)

print(
    "Productivity features:",
    len(productivity_features)
)

if OPENWEATHER_API_KEY:
    print("Weather API key loaded")
else:
    print("WARNING: Weather API key not found")

print("======================================")


# =========================================================
# HOME / HEALTH CHECK
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "message":
            "KrushiMitra ML Backend is running!",

        "apis": [

            "/api/recommend",

            "/api/predict-productivity",

            "/api/weather"

        ]

    })


# =========================================================
# CROP RECOMMENDATION API
# =========================================================

@app.route("/api/recommend", methods=["POST"])
def recommend_crop():

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No input data received"

            }), 400


        # -------------------------------------------------
        # Required fields
        # -------------------------------------------------

        required_fields = [

            "N",
            "P",
            "K",
            "temperature",
            "humidity",
            "ph",
            "rainfall"

        ]


        # -------------------------------------------------
        # Check missing fields
        # -------------------------------------------------

        missing_fields = [

            field

            for field in required_fields

            if field not in data

        ]


        if missing_fields:

            return jsonify({

                "success": False,

                "message":
                    "Missing required fields",

                "missing_fields":
                    missing_fields

            }), 400


        # -------------------------------------------------
        # Create input DataFrame
        # -------------------------------------------------

        input_data = pd.DataFrame({

            "N": [
                float(data["N"])
            ],

            "P": [
                float(data["P"])
            ],

            "K": [
                float(data["K"])
            ],

            "temperature": [
                float(data["temperature"])
            ],

            "humidity": [
                float(data["humidity"])
            ],

            "ph": [
                float(data["ph"])
            ],

            "rainfall": [
                float(data["rainfall"])
            ]

        })


        # -------------------------------------------------
        # Arrange columns exactly as during training
        # -------------------------------------------------

        input_data = input_data[
            recommendation_features
        ]


        # -------------------------------------------------
        # Prediction
        # -------------------------------------------------

        prediction = recommendation_model.predict(
            input_data
        )


        recommended_crop = str(
            prediction[0]
        )


        # -------------------------------------------------
        # Probability / confidence
        # -------------------------------------------------

        confidence = None

        if hasattr(
            recommendation_model,
            "predict_proba"
        ):

            probabilities = (
                recommendation_model
                .predict_proba(input_data)[0]
            )

            confidence = float(
                max(probabilities) * 100
            )


        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "recommended_crop":
                recommended_crop,

            "confidence":
                round(confidence, 2)
                if confidence is not None
                else None

        })


    except ValueError as e:

        return jsonify({

            "success": False,

            "message":
                "Invalid input. Please enter numeric values.",

            "error": str(e)

        }), 400


    except Exception as e:

        return jsonify({

            "success": False,

            "message":
                "Error while generating crop recommendation.",

            "error": str(e)

        }), 500


# =========================================================
# PRODUCTIVITY PREDICTION API
# =========================================================

@app.route(
    "/api/predict-productivity",
    methods=["POST"]
)
def predict_productivity():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No input data received"

            }), 400


        # -------------------------------------------------
        # Required fields
        # -------------------------------------------------

        required_fields = [

            "District_Name",
            "Crop_Year",
            "Season",
            "Crop",
            "Area",
            "Rainfall",
            "MaxTemp"

        ]


        # -------------------------------------------------
        # Check missing fields
        # -------------------------------------------------

        missing_fields = [

            field

            for field in required_fields

            if field not in data

        ]


        if missing_fields:

            return jsonify({

                "success": False,

                "message":
                    "Missing required fields",

                "missing_fields":
                    missing_fields

            }), 400


        # -------------------------------------------------
        # Create input DataFrame
        # -------------------------------------------------

        input_data = pd.DataFrame({

            "District_Name": [
                str(data["District_Name"])
            ],

            "Crop_Year": [
                int(data["Crop_Year"])
            ],

            "Season": [
                str(data["Season"])
            ],

            "Crop": [
                str(data["Crop"])
            ],

            "Area": [
                float(data["Area"])
            ],

            "Rainfall": [
                float(data["Rainfall"])
            ],

            "MaxTemp": [
                float(data["MaxTemp"])
            ]

        })


        # -------------------------------------------------
        # One-hot encoding
        # -------------------------------------------------

        input_encoded = pd.get_dummies(

            input_data,

            columns=[
                "District_Name",
                "Season",
                "Crop"
            ],

            drop_first=False

        )


        # -------------------------------------------------
        # Add missing training columns
        # -------------------------------------------------

        for column in productivity_features:

            if column not in input_encoded.columns:

                input_encoded[column] = 0


        # -------------------------------------------------
        # Keep exact training column order
        # -------------------------------------------------

        input_encoded = input_encoded[
            productivity_features
        ]


        # -------------------------------------------------
        # Prediction
        # -------------------------------------------------

        prediction = productivity_model.predict(
            input_encoded
        )


        predicted_productivity = float(
            prediction[0]
        )


        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "predicted_productivity":
                round(
                    predicted_productivity,
                    2
                )

        })


    except ValueError as e:

        return jsonify({

            "success": False,

            "message":
                "Invalid input. Please check your values.",

            "error": str(e)

        }), 400


    except Exception as e:

        return jsonify({

            "success": False,

            "message":
                "Error while predicting productivity.",

            "error": str(e)

        }), 500


# =========================================================
# WEATHER API
# =========================================================

@app.route(
    "/api/weather",
    methods=["GET"]
)
def get_weather():

    try:

        # -------------------------------------------------
        # Get city from URL
        # Example:
        # /api/weather?city=Amravati
        # -------------------------------------------------

        city = request.args.get("city")


        if not city:

            return jsonify({

                "success": False,

                "message":
                    "City name is required"

            }), 400


        # -------------------------------------------------
        # Check API key
        # -------------------------------------------------

        if not OPENWEATHER_API_KEY:

            return jsonify({

                "success": False,

                "message":
                    "Weather API key is not configured"

            }), 500


        # -------------------------------------------------
        # OpenWeather API
        # -------------------------------------------------

        url = "https://api.openweathermap.org/data/2.5/weather"


        params = {

            "q": city,

            "appid":
                OPENWEATHER_API_KEY,

            "units":
                "metric"

        }


        # -------------------------------------------------
        # Request weather data
        # -------------------------------------------------

        response = requests.get(

            url,

            params=params,

            timeout=10

        )


        data = response.json()


        # -------------------------------------------------
        # Handle OpenWeather error
        # -------------------------------------------------

        if response.status_code != 200:

            return jsonify({

                "success": False,

                "message":
                    data.get(
                        "message",
                        "Unable to fetch weather"
                    )

            }), response.status_code


        # -------------------------------------------------
        # Extract weather information
        # -------------------------------------------------

        weather = {

            "success": True,

            "city":
                data.get("name"),

            "country":
                data.get(
                    "sys",
                    {}
                ).get("country"),

            "temperature":
                data["main"]["temp"],

            "feels_like":
                data["main"]["feels_like"],

            "humidity":
                data["main"]["humidity"],

            "pressure":
                data["main"]["pressure"],

            "weather":
                data["weather"][0]["main"],

            "description":
                data["weather"][0]["description"],

            "wind_speed":
                data["wind"]["speed"],

            "cloudiness":
                data["clouds"]["all"],

            "rainfall":
                data.get(
                    "rain",
                    {}
                ).get(
                    "1h",
                    0
                )

        }


        return jsonify(weather)


    except requests.exceptions.RequestException as e:

        return jsonify({

            "success": False,

            "message":
                "Weather service is unavailable",

            "error":
                str(e)

        }), 503


    except Exception as e:

        return jsonify({

            "success": False,

            "message":
                "Error while fetching weather",

            "error":
                str(e)

        }), 500


# =========================================================
# DATABASE & AUTHENTICATION APIs
# =========================================================

@app.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
        district = data.get("district", "Pune")
        phone = data.get("phone", "")
        farm_size = str(data.get("farmSize", "5.0"))
        role = "Farmer"  # New signups are strictly farmers

        if not name or not email or not password:
            return jsonify({
                "success": False,
                "message": "Name, email, and password are required"
            }), 400

        if len(password) < 6:
            return jsonify({
                "success": False,
                "message": "Password must be at least 6 characters long"
            }), 400

        existing = database.get_user_by_email(email)
        if existing:
            return jsonify({
                "success": False,
                "message": "An account with this email address already exists"
            }), 409

        user = database.create_user(
            name=name,
            email=email,
            password=password,
            role=role,
            district=district,
            phone=phone,
            farm_size=farm_size
        )

        if not user:
            return jsonify({
                "success": False,
                "message": "Failed to create user account"
            }), 500

        # Don't return password_hash to frontend
        user_data = {k: v for k, v in user.items() if k != "password_hash"}

        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": user_data
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error during registration",
            "error": str(e)
        }), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        user = database.authenticate_user(email, password)

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        # Strip password hash before returning
        user_data = {k: v for k, v in user.items() if k != "password_hash"}

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error during login",
            "error": str(e)
        }), 500


@app.route("/api/user/profile", methods=["GET", "PUT"])
def user_profile():
    try:
        if request.method == "GET":
            email = request.args.get("email", "").strip().lower()
            if not email:
                return jsonify({"success": False, "message": "Email is required"}), 400
            user = database.get_user_by_email(email)
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 404
            user_data = {k: v for k, v in user.items() if k != "password_hash"}
            return jsonify({"success": True, "user": user_data}), 200

        elif request.method == "PUT":
            data = request.get_json() or {}
            email = data.get("email", "").strip().lower()
            if not email:
                return jsonify({"success": False, "message": "Email is required"}), 400

            updated_user = database.update_user_profile(email, data)
            if not updated_user:
                return jsonify({"success": False, "message": "User not found"}), 404

            user_data = {k: v for k, v in updated_user.items() if k != "password_hash"}
            return jsonify({
                "success": True,
                "message": "Profile updated successfully",
                "user": user_data
            }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error processing profile request",
            "error": str(e)
        }), 500


@app.route("/api/auth/change-password", methods=["POST"])
def change_password():
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        current_password = data.get("currentPassword", "").strip()
        new_password = data.get("newPassword", "").strip()

        if not email or not current_password or not new_password:
            return jsonify({
                "success": False,
                "message": "Email, current password, and new password are required"
            }), 400

        if len(new_password) < 6:
            return jsonify({
                "success": False,
                "message": "New password must be at least 6 characters long"
            }), 400

        success = database.change_user_password(email, current_password, new_password)
        if not success:
            return jsonify({
                "success": False,
                "message": "Current password is incorrect"
            }), 401

        return jsonify({
            "success": True,
            "message": "Password changed successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error changing password",
            "error": str(e)
        }), 500


# =========================================================
# ADMIN RBAC & USER MANAGEMENT APIs
# =========================================================

@app.route("/api/admin/users", methods=["GET"])
def admin_get_users():
    try:
        users = database.get_all_users()
        return jsonify({
            "success": True,
            "count": len(users),
            "users": users
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to fetch users",
            "error": str(e)
        }), 500


@app.route("/api/admin/users/<int:user_id>/role", methods=["PUT"])
def admin_update_role(user_id):
    try:
        data = request.get_json() or {}
        new_role = data.get("role", "Farmer")
        if new_role not in ["Farmer", "Admin"]:
            return jsonify({"success": False, "message": "Invalid role"}), 400

        database.update_user_role(user_id, new_role)
        return jsonify({
            "success": True,
            "message": f"User role updated to {new_role}"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error updating role", "error": str(e)}), 500


@app.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
def admin_delete_user(user_id):
    try:
        database.delete_user_by_id(user_id)
        return jsonify({
            "success": True,
            "message": "User deleted successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error deleting user", "error": str(e)}), 500


@app.route("/api/admin/stats", methods=["GET"])
def admin_stats():
    try:
        stats = database.get_system_stats()
        return jsonify({
            "success": True,
            "stats": stats
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error fetching stats", "error": str(e)}), 500


# =========================================================
# HISTORY PERSISTENCE APIs
# =========================================================

@app.route("/api/history/predictions", methods=["GET", "POST"])
def history_predictions():
    try:
        if request.method == "POST":
            data = request.get_json() or {}
            record_id = database.save_prediction_record(data)
            return jsonify({"success": True, "id": record_id}), 201
        else:
            email = request.args.get("email")
            records = database.get_prediction_history(email)
            return jsonify({"success": True, "records": records}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/history/recommendations", methods=["GET", "POST"])
def history_recommendations():
    try:
        if request.method == "POST":
            data = request.get_json() or {}
            record_id = database.save_recommendation_record(data)
            return jsonify({"success": True, "id": record_id}), 201
        else:
            email = request.args.get("email")
            records = database.get_recommendation_history(email)
            return jsonify({"success": True, "records": records}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )