import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "krushimitra.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. USERS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'Farmer',
        state TEXT DEFAULT 'Maharashtra',
        district TEXT DEFAULT 'Pune',
        farm_size TEXT DEFAULT '5.0',
        farm_unit TEXT DEFAULT 'Acres',
        soil_type TEXT DEFAULT 'Black Clayey Soil (Regur)',
        irrigation_type TEXT DEFAULT 'Drip & Canal Irrigation',
        primary_crops TEXT DEFAULT 'Soybean, Cotton, Wheat',
        kisan_id TEXT DEFAULT 'PMK-MH-2026-8941',
        farm_details TEXT,
        status TEXT DEFAULT 'Active',
        member_since TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. PREDICTIONS HISTORY TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prediction_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT,
        crop TEXT NOT NULL,
        district TEXT NOT NULL,
        season TEXT,
        area REAL,
        rainfall REAL,
        temperature REAL,
        crop_year INTEGER,
        productivity REAL NOT NULL,
        production REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. RECOMMENDATIONS HISTORY TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT,
        crop TEXT NOT NULL,
        confidence REAL,
        n_val REAL,
        p_val REAL,
        k_val REAL,
        temperature REAL,
        humidity REAL,
        ph REAL,
        rainfall REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. SUPPORT TICKETS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS support_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id TEXT UNIQUE,
        user_email TEXT,
        name TEXT,
        category TEXT,
        subject TEXT,
        message TEXT,
        status TEXT DEFAULT 'Submitted',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()

    # Seed initial Admin and Demo Farmers if users table is empty
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]

    if count == 0:
        print("[DATABASE] Seeding database with initial Administrator and Demo Farmers...")
        initial_users = [
            (
                "KrushiMitra Administrator",
                "admin@krushimitra.in",
                generate_password_hash("adminpassword"),
                "+91 98000 00001",
                "Admin",
                "Maharashtra",
                "Pune",
                "10.0",
                "Acres",
                "Black Clayey Soil (Regur)",
                "Drip & Canal Irrigation",
                "Sugarcane, Wheat, Cotton",
                "ADM-MH-2026-0001",
                "KrushiMitra Master Agronomy & Operations Desk",
                "Active",
                "January 2026"
            ),
            (
                "Ramesh Patil",
                "ramesh.patil@krushimitra.in",
                generate_password_hash("password123"),
                "+91 98230 45678",
                "Farmer",
                "Maharashtra",
                "Pune",
                "5.0",
                "Acres",
                "Black Clayey Soil (Regur)",
                "Drip & Micro-Irrigation",
                "Soybean, Cotton, Wheat",
                "PMK-MH-2026-8941",
                "Organic farming practice with focus on soil regenerative techniques.",
                "Active",
                "February 2026"
            ),
            (
                "Suresh Deshmukh",
                "suresh.deshmukh@krushimitra.in",
                generate_password_hash("password123"),
                "+91 94221 88901",
                "Farmer",
                "Maharashtra",
                "Nagpur",
                "12.5",
                "Acres",
                "Alluvial River Basin Soil",
                "Canal & Well Irrigation",
                "Orange, Cotton, Gram",
                "PMK-MH-2026-3312",
                "Citrus orchard plantation and rotation pulse crops.",
                "Active",
                "March 2026"
            ),
            (
                "Priya Shinde",
                "priya.shinde@krushimitra.in",
                generate_password_hash("password123"),
                "+91 98902 33412",
                "Farmer",
                "Maharashtra",
                "Nashik",
                "8.0",
                "Acres",
                "Red & Yellow Loamy Soil",
                "Drip & Micro-Irrigation",
                "Grapes, Onion, Tomato",
                "PMK-MH-2026-5590",
                "Export-oriented vineyard and seasonal vegetable cultivation.",
                "Active",
                "May 2026"
            ),
            (
                "Anil Jadhav",
                "anil.jadhav@krushimitra.in",
                generate_password_hash("password123"),
                "+91 97654 11223",
                "Farmer",
                "Maharashtra",
                "Amravati",
                "3.5",
                "Acres",
                "Black Clayey Soil (Regur)",
                "Rainfed / Natural Monsoon",
                "Soybean, Pigeon Pea (Tur)",
                "PMK-MH-2026-1188",
                "Rainfed pulses cultivation with bio-fertilizers.",
                "Active",
                "June 2026"
            )
        ]

        cursor.executemany("""
        INSERT INTO users (
            name, email, password_hash, phone, role, state, district,
            farm_size, farm_unit, soil_type, irrigation_type, primary_crops,
            kisan_id, farm_details, status, member_since
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_users)

        conn.commit()
        print("[DATABASE] Initial seeding complete.")

    conn.close()

# USER OPERATIONS
def create_user(name, email, password, role="Farmer", district="Pune", phone="", farm_size="5.0"):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    password_hash = generate_password_hash(password)
    member_since = datetime.now().strftime("%B %Y")
    
    try:
        cursor.execute("""
        INSERT INTO users (name, email, password_hash, role, district, phone, farm_size, member_since)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, email.strip().lower(), password_hash, role, district, phone, farm_size, member_since))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError:
        conn.close()
        return None

def authenticate_user(email, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    user = cursor.fetchone()
    conn.close()
    
    if user and check_password_hash(user["password_hash"], password):
        return dict(user)
    return None

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def update_user_profile(email, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        district = COALESCE(?, district),
        state = COALESCE(?, state),
        farm_size = COALESCE(?, farm_size),
        farm_unit = COALESCE(?, farm_unit),
        soil_type = COALESCE(?, soil_type),
        irrigation_type = COALESCE(?, irrigation_type),
        primary_crops = COALESCE(?, primary_crops),
        kisan_id = COALESCE(?, kisan_id),
        farm_details = COALESCE(?, farm_details)
    WHERE email = ?
    """, (
        data.get("name"),
        data.get("phone"),
        data.get("district"),
        data.get("state"),
        data.get("farmSize") or data.get("farm_size"),
        data.get("farmUnit") or data.get("farm_unit"),
        data.get("soilType") or data.get("soil_type"),
        data.get("irrigationType") or data.get("irrigation_type"),
        data.get("primaryCrops") or data.get("primary_crops"),
        data.get("kisanId") or data.get("kisan_id"),
        data.get("farmDetails") or data.get("farm_details"),
        email.strip().lower()
    ))
    conn.commit()
    conn.close()
    return get_user_by_email(email)

def change_user_password(email, old_password, new_password):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT password_hash FROM users WHERE email = ?", (email.strip().lower(),))
    user = cursor.fetchone()
    
    if not user or not check_password_hash(user["password_hash"], old_password):
        conn.close()
        return False
        
    new_hash = generate_password_hash(new_password)
    cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (new_hash, email.strip().lower()))
    conn.commit()
    conn.close()
    return True

def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, name, email, phone, role, state, district, farm_size, farm_unit,
           soil_type, irrigation_type, primary_crops, kisan_id, status, member_since, created_at
    FROM users ORDER BY id ASC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_user_role(user_id, new_role):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    conn.commit()
    conn.close()
    return True

def delete_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return True

# PREDICTION AND RECOMMENDATION STORAGE
def save_prediction_record(data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO prediction_history (
        user_email, crop, district, season, area, rainfall, temperature, crop_year, productivity, production
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("user_email", "guest"),
        data.get("crop", ""),
        data.get("district", ""),
        data.get("season", ""),
        float(data.get("area", 0)),
        float(data.get("rainfall", 0)),
        float(data.get("temperature", 0)),
        int(data.get("crop_year", 2026)),
        float(data.get("productivity", 0)),
        float(data.get("production", 0))
    ))
    conn.commit()
    record_id = cursor.lastrowid
    conn.close()
    return record_id

def get_prediction_history(user_email=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_email:
        cursor.execute("SELECT * FROM prediction_history WHERE user_email = ? ORDER BY id DESC", (user_email.strip().lower(),))
    else:
        cursor.execute("SELECT * FROM prediction_history ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def save_recommendation_record(data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO recommendation_history (
        user_email, crop, confidence, n_val, p_val, k_val, temperature, humidity, ph, rainfall
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("user_email", "guest"),
        data.get("crop", ""),
        float(data.get("confidence", 0)),
        float(data.get("n_val", 0)),
        float(data.get("p_val", 0)),
        float(data.get("k_val", 0)),
        float(data.get("temperature", 0)),
        float(data.get("humidity", 0)),
        float(data.get("ph", 0)),
        float(data.get("rainfall", 0))
    ))
    conn.commit()
    record_id = cursor.lastrowid
    conn.close()
    return record_id

def get_recommendation_history(user_email=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_email:
        cursor.execute("SELECT * FROM recommendation_history WHERE user_email = ? ORDER BY id DESC", (user_email.strip().lower(),))
    else:
        cursor.execute("SELECT * FROM recommendation_history ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_system_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'Farmer'")
    total_farmers = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'Admin'")
    total_admins = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM prediction_history")
    total_predictions = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM recommendation_history")
    total_recommendations = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_admins": total_admins,
        "total_predictions": total_predictions,
        "total_recommendations": total_recommendations,
        "db_status": "SQLite 3 Connected",
        "db_file": "krushimitra.db"
    }
