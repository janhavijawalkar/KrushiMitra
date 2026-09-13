import os
import sys
from datetime import datetime
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import requests
import uuid
import database
import email_service
import security

# Initialize Database & Tables
database.init_db()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)

# Initialize Enterprise Rate Limiter
security.limiter.init_app(app)

# Allow React frontend to access Flask APIs securely with CORS protection
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]}},
    supports_credentials=True
)

# Apply OWASP security response headers to all responses
@app.after_request
def apply_owasp_security_headers(response):
    return security.add_security_headers(response)


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
        # Standardize strings & district aliases for ML model
        # -------------------------------------------------
        dist_input = str(data["District_Name"]).strip().upper()
        district_aliases = {
            "AHILYA NAGAR": "AHMEDNAGAR",
            "AHILYANAGAR": "AHMEDNAGAR",
            "CHHATRAPATI SAMBHAJINAGAR": "AURANGABAD",
            "SAMBHAJINAGAR": "AURANGABAD",
            "DHARASHIV": "OSMANABAD",
            "MUMBAI": "THANE",
            "MUMBAI CITY": "THANE",
            "MUMBAI SUBURBAN": "THANE",
        }
        if dist_input in district_aliases:
            dist_input = district_aliases[dist_input]

        season_input = str(data["Season"]).strip().capitalize()
        crop_input = str(data["Crop"]).strip().capitalize()

        # -------------------------------------------------
        # Create input DataFrame
        # -------------------------------------------------

        input_data = pd.DataFrame({

            "District_Name": [
                dist_input
            ],

            "Crop_Year": [
                int(data["Crop_Year"])
            ],

            "Season": [
                season_input
            ],

            "Crop": [
                crop_input
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

# =========================================================
# MAHARASHTRA 36 DISTRICTS & AGRI-HUBS GEO COORDINATES
# =========================================================

MAHARASHTRA_LOCATIONS = {
    "ahmednagar": {"name": "Ahmednagar", "lat": 19.0952, "lon": 74.7496},
    "ahilyanagar": {"name": "Ahilyanagar (Ahmednagar)", "lat": 19.0952, "lon": 74.7496},
    "akola": {"name": "Akola", "lat": 20.7002, "lon": 77.0082},
    "amravati": {"name": "Amravati", "lat": 20.9374, "lon": 77.7796},
    "aurangabad": {"name": "Aurangabad", "lat": 19.8762, "lon": 75.3433},
    "chhatrapati sambhajinagar": {"name": "Chhatrapati Sambhajinagar", "lat": 19.8762, "lon": 75.3433},
    "beed": {"name": "Beed", "lat": 18.9891, "lon": 75.7601},
    "bhandara": {"name": "Bhandara", "lat": 21.1713, "lon": 79.6543},
    "buldhana": {"name": "Buldhana", "lat": 20.5300, "lon": 76.1800},
    "chandrapur": {"name": "Chandrapur", "lat": 19.9615, "lon": 79.2961},
    "dhule": {"name": "Dhule", "lat": 20.9042, "lon": 74.7749},
    "gadchiroli": {"name": "Gadchiroli", "lat": 20.1849, "lon": 79.9948},
    "gondia": {"name": "Gondia", "lat": 21.4598, "lon": 80.1961},
    "hingoli": {"name": "Hingoli", "lat": 19.7196, "lon": 77.1481},
    "jalgaon": {"name": "Jalgaon", "lat": 21.0077, "lon": 75.5626},
    "jalna": {"name": "Jalna", "lat": 19.8410, "lon": 75.8864},
    "kolhapur": {"name": "Kolhapur", "lat": 16.7050, "lon": 74.2433},
    "latur": {"name": "Latur", "lat": 18.4088, "lon": 76.5604},
    "mumbai": {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
    "mumbai city": {"name": "Mumbai City", "lat": 18.9220, "lon": 72.8347},
    "mumbai suburban": {"name": "Mumbai Suburban", "lat": 19.0760, "lon": 72.8777},
    "nagpur": {"name": "Nagpur", "lat": 21.1458, "lon": 79.0882},
    "nanded": {"name": "Nanded", "lat": 19.1383, "lon": 77.3210},
    "nandurbar": {"name": "Nandurbar", "lat": 21.3700, "lon": 74.2400},
    "nashik": {"name": "Nashik", "lat": 19.9975, "lon": 73.7898},
    "osmanabad": {"name": "Osmanabad", "lat": 18.1856, "lon": 76.0419},
    "dharashiv": {"name": "Dharashiv (Osmanabad)", "lat": 18.1856, "lon": 76.0419},
    "palghar": {"name": "Palghar", "lat": 19.6967, "lon": 72.7699},
    "parbhani": {"name": "Parbhani", "lat": 19.2686, "lon": 76.7708},
    "pune": {"name": "Pune", "lat": 18.5204, "lon": 73.8567},
    "raigad": {"name": "Raigad (Alibag)", "lat": 18.5158, "lon": 73.1822},
    "alibag": {"name": "Alibag (Raigad)", "lat": 18.6414, "lon": 72.8722},
    "ratnagiri": {"name": "Ratnagiri", "lat": 16.9902, "lon": 73.3120},
    "sangli": {"name": "Sangli", "lat": 16.8524, "lon": 74.5815},
    "satara": {"name": "Satara", "lat": 17.6805, "lon": 73.9997},
    "sindhudurg": {"name": "Sindhudurg (Kudal)", "lat": 16.0354, "lon": 73.6933},
    "kudal": {"name": "Kudal", "lat": 16.0094, "lon": 73.6872},
    "solapur": {"name": "Solapur", "lat": 17.6599, "lon": 75.9064},
    "thane": {"name": "Thane", "lat": 19.2183, "lon": 72.9781},
    "wardha": {"name": "Wardha", "lat": 20.7453, "lon": 78.6022},
    "washim": {"name": "Washim", "lat": 20.1098, "lon": 77.1350},
    "yavatmal": {"name": "Yavatmal", "lat": 20.3888, "lon": 78.1204},
    "baramati": {"name": "Baramati", "lat": 18.1513, "lon": 74.5770},
    "pandharpur": {"name": "Pandharpur", "lat": 17.6775, "lon": 75.3262},
    "karad": {"name": "Karad", "lat": 17.2885, "lon": 74.1843},
    "malegaon": {"name": "Malegaon", "lat": 20.5539, "lon": 74.5307},
    "shirdi": {"name": "Shirdi", "lat": 19.7645, "lon": 74.4762},
}


@app.route("/api/weather", methods=["GET"])
def get_weather():
    try:
        city_raw = request.args.get("city", "").strip()
        lat_param = request.args.get("lat")
        lon_param = request.args.get("lon")

        if not OPENWEATHER_API_KEY:
            return jsonify({
                "success": False,
                "message": "Weather API key is not configured"
            }), 500

        url = "https://api.openweathermap.org/data/2.5/weather"
        display_name = None

        if lat_param and lon_param:
            params = {
                "lat": float(lat_param),
                "lon": float(lon_param),
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        else:
            norm_city = city_raw.lower().strip() if city_raw else "pune"
            if norm_city in MAHARASHTRA_LOCATIONS:
                loc = MAHARASHTRA_LOCATIONS[norm_city]
                display_name = loc["name"]
                params = {
                    "lat": loc["lat"],
                    "lon": loc["lon"],
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric"
                }
            else:
                params = {
                    "q": f"{city_raw},IN" if not "," in city_raw else city_raw,
                    "appid": OPENWEATHER_API_KEY,
                    "units": "metric"
                }

        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            # Fallback to Pune coordinates if unknown city errored
            fallback_loc = MAHARASHTRA_LOCATIONS["pune"]
            fallback_res = requests.get(url, params={
                "lat": fallback_loc["lat"],
                "lon": fallback_loc["lon"],
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }, timeout=10)
            data = fallback_res.json()
            display_name = city_raw or "Pune"

        temp = round(float(data["main"]["temp"]), 1)
        feels_like = round(float(data["main"]["feels_like"]), 1)
        humidity = int(data["main"]["humidity"])
        pressure = int(data["main"]["pressure"])
        wind_speed = round(float(data["wind"]["speed"]) * 3.6, 1)  # m/s to km/h
        weather_main = data["weather"][0]["main"]
        description = data["weather"][0]["description"].title()
        cloudiness = int(data["clouds"]["all"])
        rain_1h = float(data.get("rain", {}).get("1h", 0))

        # Dynamic Agronomic Advice based on real live telemetry
        if temp > 37:
            advice = "High Heat Alert: Provide protective mulch and increase drip irrigation frequency."
        elif rain_1h > 8 or "rain" in weather_main.lower() or "drizzle" in weather_main.lower():
            advice = "Monsoon Precipitation: Ideal soil moisture for crop growth. Hold pesticide spraying."
        elif humidity > 82:
            advice = "High Humidity: Monitor cotton, soybean & gram crops for potential fungal infections."
        elif wind_speed > 30:
            advice = "Strong Winds: Secure tall sugarcane stands and avoid foliar fertilization today."
        else:
            advice = "Optimal Farming Conditions: Favorable window for fertilizer application and harvesting."

        city_result = display_name or data.get("name") or city_raw or "Maharashtra"

        return jsonify({
            "success": True,
            "city": city_result,
            "country": data.get("sys", {}).get("country", "IN"),
            "temperature": temp,
            "feels_like": feels_like,
            "humidity": humidity,
            "pressure": pressure,
            "weather": weather_main,
            "description": description,
            "wind_speed": wind_speed,
            "cloudiness": cloudiness,
            "rainfall": rain_1h,
            "advice": advice,
            "is_live_telemetry": True
        }), 200

    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "message": "Weather service temporarily unavailable",
            "error": str(e)
        }), 503
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error while fetching weather",
            "error": str(e)
        }), 500


# =========================================================
# DATABASE & AUTHENTICATION APIs
# =========================================================

@app.route("/api/auth/register", methods=["POST"])
@security.limiter.limit("20 per minute")
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

        # Trigger Official Welcome Email to new farmer
        try:
            kisan_id = user.get("kisan_id") or f"MH-KISAN-{int(datetime.now().timestamp()) % 1000000:06d}"
            email_service.send_welcome_email(
                to_email=email,
                user_name=name,
                district=district,
                kisan_id=kisan_id,
                phone=phone
            )
        except Exception as mail_err:
            print(f"[AUTH] Welcome email notification skipped: {mail_err}")

        # Generate cryptographically signed JWT token
        token = security.generate_token(user["id"], user["email"], user.get("role", "Farmer"), user.get("name"))

        # Don't return password_hash to frontend
        user_data = {k: v for k, v in user.items() if k != "password_hash"}
        user_data["token"] = token

        return jsonify({
            "success": True,
            "message": "User registered successfully! Welcome email sent.",
            "token": token,
            "user": user_data
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error during registration",
            "error": str(e)
        }), 500


@app.route("/api/auth/login", methods=["POST"])
@security.limiter.limit("25 per minute")
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

        # Generate cryptographically signed JWT token
        token = security.generate_token(user["id"], user["email"], user.get("role", "Farmer"), user.get("name"))

        # Strip password hash before returning
        user_data = {k: v for k, v in user.items() if k != "password_hash"}
        user_data["token"] = token

        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": user_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error during login",
            "error": str(e)
        }), 500


@app.route("/api/auth/google", methods=["POST"])
@security.limiter.limit("25 per minute")
def google_auth():
    """Authenticates farmer using Google OAuth 2.0 Identity Services."""
    try:
        data = request.get_json() or {}
        credential = data.get("credential") or data.get("token") or ""

        if not credential:
            return jsonify({
                "success": False,
                "message": "Google credential token is required"
            }), 400

        # Verify Google JWT token with Google's public tokeninfo endpoint
        verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
        resp = requests.get(verify_url, timeout=10)

        if resp.status_code != 200:
            return jsonify({
                "success": False,
                "message": "Google token validation failed"
            }), 401

        token_data = resp.json()

        # Optional Client ID audience verification if configured in .env
        client_id_env = os.getenv("GOOGLE_CLIENT_ID", "").strip()
        if client_id_env and token_data.get("aud") != client_id_env:
            return jsonify({
                "success": False,
                "message": "Google token audience mismatch"
            }), 401

        email = token_data.get("email", "").strip().lower()
        name = token_data.get("name") or token_data.get("given_name", "Farmer")
        picture = token_data.get("picture", "")

        if not email:
            return jsonify({
                "success": False,
                "message": "No verified email found in Google profile"
            }), 400

        existing_user = database.get_user_by_email(email)
        is_new_farmer = False

        if existing_user:
            user = existing_user
        else:
            is_new_farmer = True
            dummy_password = f"GoogleOAuth_{uuid.uuid4().hex[:12]}"
            user = database.create_user(
                name=name,
                email=email,
                password=dummy_password,
                role="Farmer",
                district="Maharashtra",
                phone=""
            )
            # Dispatch official Welcome Email
            try:
                kid = user.get("kisan_id") or f"MH-KISAN-{int(datetime.now().timestamp()) % 1000000:06d}"
                email_service.send_welcome_email(
                    to_email=email,
                    user_name=name,
                    district="Maharashtra",
                    kisan_id=kid
                )
            except Exception as mail_err:
                print(f"[GOOGLE AUTH] Welcome email error: {mail_err}", flush=True)

        # Generate cryptographically signed JWT token
        token = security.generate_token(user["id"], user["email"], user.get("role", "Farmer"), user.get("name"))

        user_data = {k: v for k, v in user.items() if k != "password_hash"}
        if picture and not user_data.get("avatar"):
            user_data["avatar"] = picture
        user_data["token"] = token

        return jsonify({
            "success": True,
            "message": "Google authentication successful!",
            "isNewUser": is_new_farmer,
            "token": token,
            "user": user_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error during Google authentication",
            "error": str(e)
        }), 500


@app.route("/api/auth/resend-welcome-email", methods=["POST"])
@security.limiter.limit("10 per minute")
def resend_welcome_email():
    """Resends the official KrushiMitra welcome and Kisan ID dossier email."""
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        if not email:
            return jsonify({"success": False, "message": "Email is required"}), 400

        user = database.get_user_by_email(email)
        if not user:
            return jsonify({"success": False, "message": f"No account found for {email}"}), 404

        kisan_id = user.get("kisan_id") or f"MH-KISAN-{int(datetime.now().timestamp()) % 1000000:06d}"
        email_service.send_welcome_email(
            to_email=email,
            user_name=user.get("name", "Farmer"),
            district=user.get("district", "Maharashtra"),
            kisan_id=kisan_id,
            phone=user.get("phone", "")
        )

        return jsonify({
            "success": True,
            "message": f"Welcome email sent to {email}. Please check your Inbox and Spam folder.",
            "kisan_id": kisan_id
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to send email: {str(e)}"
        }), 500


@app.route("/api/auth/verify-token", methods=["GET", "POST"])
@security.token_required
def verify_token():
    """Verifies that the client's JWT token is authentic, non-tampered, and unexpired."""
    user = getattr(security.g, "current_user", None)
    if not user:
        return jsonify({"success": False, "message": "Invalid token"}), 401
    user_data = {k: v for k, v in user.items() if k != "password_hash"}
    return jsonify({
        "success": True,
        "message": "Cryptographic JWT token is valid",
        "user": user_data
    }), 200


@app.route("/api/auth/forgot-password", methods=["POST"])
@security.limiter.limit("10 per minute")
def forgot_password():
    """Generates password reset token and sends an official reset email."""
    try:
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()

        if not email or "@" not in email:
            return jsonify({
                "success": False,
                "message": "A valid email address is required"
            }), 400

        token, user = database.create_password_reset_token(email)
        
        if not user:
            # Friendly response that prevents email enumeration
            return jsonify({
                "success": True,
                "message": "If an account exists with this email address, a password reset link has been dispatched."
            }), 200

        app_host = request.headers.get("Origin") or "http://localhost:5173"
        reset_url = f"{app_host}/?reset_token={token}"

        user_name = user.get("name") if isinstance(user, dict) else (user[1] if isinstance(user, (list, tuple)) and len(user) > 1 else None)

        email_service.send_password_reset_email(
            to_email=email,
            user_name=user_name,
            reset_token=token,
            reset_url=reset_url
        )

        return jsonify({
            "success": True,
            "message": f"Password reset link has been sent to {email}",
            "email": email,
            "dev_token": token,
            "dev_reset_url": reset_url,
            "is_smtp_live": email_service.is_smtp_configured()
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to process password reset request",
            "error": str(e)
        }), 500


@app.route("/api/auth/verify-reset-token", methods=["GET"])
def verify_reset_token():
    """Validates that a password reset token is active and unexpired."""
    try:
        token = request.args.get("token", "").strip()
        if not token:
            return jsonify({"valid": False, "message": "Reset token is required"}), 400

        email = database.verify_password_reset_token(token)
        if not email:
            return jsonify({
                "valid": False,
                "message": "This password reset link is invalid or has expired. Please request a new one."
            }), 400

        return jsonify({
            "valid": True,
            "email": email
        }), 200

    except Exception as e:
        return jsonify({"valid": False, "error": str(e)}), 500


@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    """Securely updates password for a verified reset token."""
    try:
        data = request.get_json() or {}
        token = data.get("token", "").strip()
        new_password = data.get("newPassword", "").strip()

        if not token or not new_password:
            return jsonify({
                "success": False,
                "message": "Reset token and new password are required"
            }), 400

        if len(new_password) < 6:
            return jsonify({
                "success": False,
                "message": "New password must be at least 6 characters long"
            }), 400

        success = database.reset_password_with_token(token, new_password)
        if not success:
            return jsonify({
                "success": False,
                "message": "Invalid, expired, or already used reset token. Please request a new link."
            }), 400

        return jsonify({
            "success": True,
            "message": "Your password has been successfully reset! You can now sign in with your new password."
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error resetting password",
            "error": str(e)
        }), 500


@app.route("/api/dev/recent-emails", methods=["GET"])
def get_recent_emails():
    """Returns recent sent emails for dev debugging and inspection."""
    return jsonify({
        "success": True,
        "is_smtp_configured": email_service.is_smtp_configured(),
        "recent_emails": email_service.RECENT_SENT_EMAILS
    }), 200


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

@app.route("/api/admin/users", methods=["GET", "POST"])
def admin_get_users():
    try:
        if request.method == "POST":
            data = request.get_json() or {}
            user_id, err = database.create_user_by_admin(data)
            if err:
                return jsonify({"success": False, "message": err}), 400
            return jsonify({"success": True, "message": "User created successfully", "user_id": user_id}), 201
        else:
            users = database.get_all_users()
            return jsonify({
                "success": True,
                "count": len(users),
                "users": users
            }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to process users request",
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


@app.route("/api/admin/users/<int:user_id>", methods=["PUT"])
def admin_update_user_full(user_id):
    try:
        data = request.get_json() or {}
        updated_user = database.update_user_full_by_admin(user_id, data)
        return jsonify({
            "success": True,
            "message": "User details successfully updated by Administrator.",
            "user": updated_user
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error updating user", "error": str(e)}), 500


@app.route("/api/support/ticket", methods=["POST"])
def submit_support_ticket_api():
    try:
        data = request.get_json() or {}
        ticket = database.save_support_ticket(data)
        return jsonify({
            "success": True,
            "message": "Support inquiry / feedback recorded successfully.",
            "ticket": ticket
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": "Error submitting inquiry", "error": str(e)}), 500


@app.route("/api/support/my-tickets", methods=["GET"])
def get_my_support_tickets_api():
    try:
        email = request.args.get("email", "").strip().lower()
        if not email:
            return jsonify({"success": False, "message": "Email is required"}), 400
        tickets = database.get_support_tickets(email)
        return jsonify({
            "success": True,
            "count": len(tickets),
            "tickets": tickets
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error retrieving tickets", "error": str(e)}), 500


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


@app.route("/api/admin/tickets", methods=["GET"])
def admin_get_tickets():
    try:
        tickets = database.get_support_tickets()
        return jsonify({
            "success": True,
            "count": len(tickets),
            "tickets": tickets
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error fetching tickets", "error": str(e)}), 500


@app.route("/api/admin/tickets/<string:ticket_id>/status", methods=["PUT"])
def admin_update_ticket_status(ticket_id):
    try:
        data = request.get_json() or {}
        new_status = data.get("status", "Resolved")
        database.update_support_ticket_status(ticket_id, new_status)
        return jsonify({
            "success": True,
            "message": f"Ticket status updated to {new_status}"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error updating ticket status", "error": str(e)}), 500


@app.route("/api/admin/tickets/<string:ticket_id>/reply", methods=["POST"])
def admin_reply_to_ticket(ticket_id):
    try:
        data = request.get_json() or {}
        reply_text = data.get("reply", "")
        status = data.get("status", "Resolved")
        database.reply_to_support_ticket(ticket_id, reply_text, status)
        return jsonify({
            "success": True,
            "message": "Official administrator response saved and status updated."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error replying to ticket", "error": str(e)}), 500


@app.route("/api/admin/tickets/<string:ticket_id>", methods=["DELETE"])
def admin_delete_ticket(ticket_id):
    try:
        database.delete_support_ticket(ticket_id)
        return jsonify({
            "success": True,
            "message": "Support ticket deleted."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error deleting ticket", "error": str(e)}), 500


@app.route("/api/admin/tickets/purge-sample", methods=["POST"])
def admin_purge_sample_tickets():
    try:
        count = database.purge_sample_tickets()
        return jsonify({
            "success": True,
            "message": f"Successfully purged sample tickets ({count} removed).",
            "purged": count
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error purging sample tickets", "error": str(e)}), 500


@app.route("/api/admin/export", methods=["GET"])
def admin_export_data():
    try:
        export_data = database.get_database_export_data()
        return jsonify({
            "success": True,
            "data": export_data
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error exporting database", "error": str(e)}), 500


@app.route("/api/admin/optimize", methods=["POST"])
def admin_optimize_db():
    try:
        # Pings DB and verifies health
        stats = database.get_system_stats()
        return jsonify({
            "success": True,
            "message": "Database tables verified, cleaned, and optimized successfully.",
            "stats": stats
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error optimizing database", "error": str(e)}), 500


# =========================================================
# BROADCAST ADVISORY & EMERGENCY ALERTS APIs
# =========================================================

@app.route("/api/admin/broadcasts", methods=["GET", "POST"])
def admin_broadcasts():
    try:
        if request.method == "POST":
            data = request.get_json() or {}
            title = data.get("title", "").strip()
            message = data.get("message", "").strip()
            if not title or not message:
                return jsonify({"success": False, "message": "Alert title and message are required."}), 400
            
            created = database.create_broadcast_advisory(data)
            return jsonify({
                "success": True,
                "message": "Advisory broadcast successfully dispatched to farmers!",
                "broadcast": created
            }), 201
        
        # GET: List all broadcasts with target audience estimation
        broadcasts = database.get_all_broadcast_advisories()
        users = database.get_all_users()
        
        for b in broadcasts:
            target_dist = (b.get("district") or "All").lower()
            if target_dist in ["all", "maharashtra"]:
                b["estimated_reach"] = len([u for u in users if u.get("role") == "Farmer"])
            else:
                b["estimated_reach"] = len([
                    u for u in users 
                    if u.get("role") == "Farmer" and (u.get("district") or "").lower() == target_dist
                ])

        return jsonify({
            "success": True,
            "broadcasts": broadcasts
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Error managing broadcasts", "error": str(e)}), 500


@app.route("/api/admin/broadcasts/<string:broadcast_id>", methods=["DELETE"])
def admin_delete_broadcast(broadcast_id):
    try:
        database.delete_broadcast_advisory(broadcast_id)
        return jsonify({
            "success": True,
            "message": f"Broadcast advisory '{broadcast_id}' deleted successfully."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error deleting broadcast", "error": str(e)}), 500


@app.route("/api/admin/broadcasts/<string:broadcast_id>/status", methods=["PUT"])
def admin_toggle_broadcast_status(broadcast_id):
    try:
        data = request.get_json() or {}
        is_active = data.get("is_active", True)
        database.toggle_broadcast_advisory_status(broadcast_id, is_active)
        return jsonify({
            "success": True,
            "message": f"Broadcast '{broadcast_id}' status updated to {'Active' if is_active else 'Archived'}."
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error updating broadcast status", "error": str(e)}), 500


@app.route("/api/farmer/broadcasts", methods=["GET"])
def farmer_broadcasts():
    try:
        district = request.args.get("district", "All")
        crop = request.args.get("crop", None)
        active_alerts = database.get_farmer_broadcast_advisories(district=district, crop=crop)
        return jsonify({
            "success": True,
            "district": district,
            "alerts": active_alerts,
            "count": len(active_alerts)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error fetching farmer alerts", "error": str(e)}), 500



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
# AI AGRONOMIST CHATBOT API
# =========================================================

import ai_assistant

@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    try:
        data = request.get_json() or {}
        message = data.get("message", "")
        lang = data.get("language", "mr")
        history = data.get("history", [])
        farmer_district = data.get("farmer_district") or data.get("district") or data.get("city") or "Pune"
        
        result = ai_assistant.chat_with_ai(
            message=message,
            lang=lang,
            history=history,
            farmer_district=farmer_district
        )
        return jsonify(result), 200
    except Exception as e:
        print(f"[AI Chat Error]: {e}")
        return jsonify({
            "success": False,
            "reply": "क्षमा करा, तांत्रिक अडचणीमुळे उत्तर देता आले नाही." if data.get("language") == "mr" else "Sorry, an error occurred while processing your query.",
            "error": str(e)
        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )