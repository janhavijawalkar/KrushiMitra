import os
import sqlite3
import secrets
import urllib.parse
import ssl
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date, timedelta
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Database Configuration
# Support standard cloud connection strings: DATABASE_URL, MYSQL_URL, etc.
RAW_DB_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("MYSQL_URL")
    or os.getenv("MYSQL_PUBLIC_URL")
    or os.getenv("JAWSDB_URL")
    or os.getenv("CLEARDB_DATABASE_URL")
    or ""
).strip()

DB_TYPE = os.getenv("DB_TYPE", "mysql").lower().strip()
MYSQL_HOST = os.getenv("MYSQL_HOST", "127.0.0.1")
try:
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
except (ValueError, TypeError):
    MYSQL_PORT = 3306
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DB = os.getenv("MYSQL_DB") or os.getenv("MYSQL_DATABASE") or os.getenv("MYSQLDATABASE") or "krushimitra"
MYSQL_SSL_MODE = os.getenv("MYSQL_SSL", "").lower().strip()

# If connection URL is provided, parse it
if RAW_DB_URL:
    try:
        normalized_url = RAW_DB_URL
        if normalized_url.startswith("mysql2://"):
            normalized_url = "mysql://" + normalized_url[9:]
        
        parsed = urllib.parse.urlparse(normalized_url)
        if parsed.scheme.startswith("mysql"):
            DB_TYPE = "mysql"
            if parsed.hostname:
                MYSQL_HOST = parsed.hostname
            if parsed.port:
                MYSQL_PORT = parsed.port
            if parsed.username:
                MYSQL_USER = urllib.parse.unquote(parsed.username)
            if parsed.password:
                MYSQL_PASSWORD = urllib.parse.unquote(parsed.password)
            if parsed.path and len(parsed.path) > 1:
                MYSQL_DB = parsed.path.lstrip("/")
            
            query_params = urllib.parse.parse_qs(parsed.query)
            if "ssl-mode" in query_params or "sslmode" in query_params or "ssl" in query_params:
                MYSQL_SSL_MODE = "required"
    except Exception as e:
        print(f"[DATABASE] Error parsing DATABASE_URL: {e}")

SQLITE_PATH = os.getenv("SQLITE_PATH", os.path.join(BASE_DIR, "krushimitra.db"))

_active_engine = None

try:
    import pymysql
    from pymysql.cursors import DictCursor
    HAS_PYMYSQL = True
except ImportError:
    HAS_PYMYSQL = False

def _build_ssl_context():
    """Builds an SSL context suitable for cloud MySQL providers (Aiven, TiDB, Railway, AWS, PlanetScale)."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx
    except Exception:
        return None

def get_db():
    """
    Returns an active database connection.
    Attempts MySQL first if DB_TYPE is mysql, otherwise falls back to SQLite.
    Supports local MySQL, cloud connection URLs, and SSL certificates automatically.
    """
    global _active_engine

    if DB_TYPE == "mysql" and HAS_PYMYSQL:
        is_remote_host = MYSQL_HOST not in ("127.0.0.1", "localhost", "")
        use_ssl = (
            MYSQL_SSL_MODE in ("true", "1", "required", "yes")
            or (is_remote_host and MYSQL_SSL_MODE != "false")
        )
        ssl_ctx = _build_ssl_context() if use_ssl else None

        def _try_connect(with_ssl):
            connect_kwargs = {
                "host": MYSQL_HOST,
                "port": MYSQL_PORT,
                "user": MYSQL_USER,
                "password": MYSQL_PASSWORD,
                "database": MYSQL_DB,
                "cursorclass": DictCursor,
                "autocommit": True,
                "connect_timeout": 10,
                "charset": "utf8mb4"
            }
            if with_ssl and ssl_ctx:
                connect_kwargs["ssl"] = ssl_ctx
            return pymysql.connect(**connect_kwargs)

        try:
            # First ensure database exists if connecting locally with root/admin privileges
            if not is_remote_host:
                try:
                    temp_conn = pymysql.connect(
                        host=MYSQL_HOST,
                        port=MYSQL_PORT,
                        user=MYSQL_USER,
                        password=MYSQL_PASSWORD,
                        connect_timeout=3
                    )
                    with temp_conn.cursor() as cur:
                        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                    temp_conn.commit()
                    temp_conn.close()
                except Exception:
                    pass

            # Connect with SSL if remote, fallback to unencrypted if needed
            try:
                conn = _try_connect(with_ssl=use_ssl)
            except Exception as first_err:
                if use_ssl:
                    try:
                        conn = _try_connect(with_ssl=False)
                    except Exception:
                        raise first_err
                else:
                    raise first_err

            _active_engine = "mysql"
            return conn, "mysql"
        except Exception as e:
            print(f"[DATABASE WARNING] MySQL connection to {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB} failed ({e}). Falling back to SQLite.")

    # SQLite fallback
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    _active_engine = "sqlite"
    return conn, "sqlite"

def _serialize_row(row):
    if not row:
        return row
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, (datetime, date)):
            d[k] = v.strftime("%Y-%m-%d %H:%M:%S")
    return d

def execute_query(sql, params=(), fetch_mode="none"):
    """
    Executes a SQL query safely across both MySQL and SQLite.
    Converts '?' placeholders to '%s' when targeting MySQL.
    """
    conn, engine = get_db()
    cursor = conn.cursor()

    formatted_sql = sql
    if engine == "mysql":
        formatted_sql = sql.replace("?", "%s")

    try:
        cursor.execute(formatted_sql, params)

        if fetch_mode == "one":
            row = cursor.fetchone()
            if row is not None:
                return _serialize_row(row)
            return None

        elif fetch_mode == "all":
            rows = cursor.fetchall()
            return [_serialize_row(r) for r in rows]

        elif fetch_mode == "insert":
            if engine == "sqlite":
                conn.commit()
                last_id = cursor.lastrowid
            else:
                last_id = cursor.lastrowid
            return last_id

        else:
            if engine == "sqlite":
                conn.commit()
            return True

    finally:
        cursor.close()
        conn.close()

def execute_insert(sql, params=()):
    """
    Executes an INSERT statement and returns the newly created row ID.
    """
    return execute_query(sql, params, fetch_mode="insert")

def init_db():
    """
    Initializes database tables and seeds demo administrator and farmers.
    """
    conn, engine = get_db()
    cursor = conn.cursor()

    if engine == "mysql":
        print(f"[DATABASE] Connected to MySQL Server ({MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB})")
        
        # 1. Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            phone VARCHAR(30) DEFAULT '',
            role VARCHAR(50) NOT NULL DEFAULT 'Farmer',
            state VARCHAR(100) DEFAULT 'Maharashtra',
            district VARCHAR(100) DEFAULT 'Pune',
            farm_size VARCHAR(50) DEFAULT '',
            farm_unit VARCHAR(20) DEFAULT 'Acres',
            soil_type VARCHAR(150) DEFAULT '',
            irrigation_type VARCHAR(150) DEFAULT '',
            primary_crops VARCHAR(255) DEFAULT '',
            kisan_id VARCHAR(100) DEFAULT '',
            farm_details TEXT,
            status VARCHAR(30) DEFAULT 'Active',
            member_since VARCHAR(50) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_users_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        # 2. Prediction History Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS prediction_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_email VARCHAR(150) NOT NULL,
            crop VARCHAR(100) NOT NULL,
            district VARCHAR(100) NOT NULL,
            season VARCHAR(50) NOT NULL,
            area DOUBLE NOT NULL,
            rainfall DOUBLE NOT NULL,
            temperature DOUBLE NOT NULL,
            crop_year INT NOT NULL,
            productivity DOUBLE NOT NULL,
            production DOUBLE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_pred_user (user_email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        # 3. Recommendation History Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendation_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_email VARCHAR(150) NOT NULL,
            crop VARCHAR(100) NOT NULL,
            confidence DOUBLE NOT NULL,
            nitrogen DOUBLE NOT NULL,
            phosphorus DOUBLE NOT NULL,
            potassium DOUBLE NOT NULL,
            temperature DOUBLE NOT NULL,
            humidity DOUBLE NOT NULL,
            ph DOUBLE NOT NULL,
            rainfall DOUBLE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_rec_user (user_email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        # 4. Support Inquiries Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS support_tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_name VARCHAR(150) NOT NULL,
            user_email VARCHAR(150) NOT NULL,
            subject VARCHAR(200) NOT NULL,
            category VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(30) DEFAULT 'Open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        # 5. Password Resets Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            used TINYINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_resets_token (token),
            INDEX idx_resets_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        # 6. Broadcast Advisories Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS broadcast_advisories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            broadcast_id VARCHAR(50) UNIQUE,
            title VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            severity VARCHAR(30) NOT NULL DEFAULT 'Warning',
            category VARCHAR(50) NOT NULL DEFAULT 'Weather',
            district VARCHAR(100) NOT NULL DEFAULT 'All',
            crop VARCHAR(100) NOT NULL DEFAULT 'All',
            action_recommendation VARCHAR(255) DEFAULT '',
            created_by VARCHAR(150) NOT NULL DEFAULT 'KrushiMitra State Agriculture Authority',
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_broadcast_district (district),
            INDEX idx_broadcast_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

    else:
        print(f"[DATABASE] Connected to SQLite Database ({SQLITE_PATH})")
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            phone TEXT DEFAULT '',
            role TEXT NOT NULL DEFAULT 'Farmer',
            state TEXT DEFAULT 'Maharashtra',
            district TEXT DEFAULT 'Pune',
            farm_size TEXT DEFAULT '',
            farm_unit TEXT DEFAULT 'Acres',
            soil_type TEXT DEFAULT '',
            irrigation_type TEXT DEFAULT '',
            primary_crops TEXT DEFAULT '',
            kisan_id TEXT DEFAULT '',
            status TEXT DEFAULT 'Active',
            member_since TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

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

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS broadcast_advisories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            broadcast_id TEXT UNIQUE,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            severity TEXT NOT NULL DEFAULT 'Warning',
            category TEXT NOT NULL DEFAULT 'Weather',
            district TEXT NOT NULL DEFAULT 'All',
            crop TEXT NOT NULL DEFAULT 'All',
            action_recommendation TEXT DEFAULT '',
            created_by TEXT NOT NULL DEFAULT 'KrushiMitra State Agriculture Authority',
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        conn.commit()

    # Check and Seed Initial Users
    cursor.execute("SELECT COUNT(*) FROM users")
    res = cursor.fetchone()
    count = res["COUNT(*)"] if isinstance(res, dict) else res[0]

    if count == 0:
        print("[DATABASE] Seeding database with Administrator and Demo Farmers...")
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

        insert_sql = """
        INSERT INTO users (
            name, email, password_hash, phone, role, state, district,
            farm_size, farm_unit, soil_type, irrigation_type, primary_crops,
            kisan_id, farm_details, status, member_since
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        for user_tuple in initial_users:
            if engine == "mysql":
                cursor.execute(insert_sql.replace("?", "%s"), user_tuple)
            else:
                cursor.execute(insert_sql, user_tuple)

        if engine == "sqlite":
            conn.commit()
        print("[DATABASE] Initial user seeding complete.")

    def _extract_count(row):
        if not row:
            return 0
        if isinstance(row, dict):
            return list(row.values())[0] if row else 0
        return row[0]

    # 2. Support tickets are completely dynamic (submitted by real users)

    # 3. Seed Initial Predictions if table is empty
    cursor.execute("SELECT COUNT(*) FROM prediction_history")
    pred_row = cursor.fetchone()
    pred_count = _extract_count(pred_row)
    if pred_count == 0:
        sample_preds = [
            ("ramesh.patil@krushimitra.in", "Sugarcane", "Pune", "Kharif", 5.0, 850.0, 29.5, 2026, 92.4, 462.0),
            ("sunita.deshmukh@krushimitra.in", "Grapes", "Nashik", "Rabi", 4.0, 520.0, 24.2, 2026, 22.8, 91.2),
            ("anil.jadhav@krushimitra.in", "Soybean", "Amravati", "Kharif", 3.5, 780.0, 28.1, 2026, 8.1, 28.35),
            ("dnyaneshwar.patil@krushimitra.in", "Wheat", "Kolhapur", "Rabi", 6.0, 480.0, 22.0, 2026, 31.5, 189.0),
            ("priya.shinde@krushimitra.in", "Cotton", "Nagpur", "Kharif", 8.0, 920.0, 31.0, 2026, 18.2, 145.6),
            ("admin@krushimitra.in", "Rice", "Satara", "Kharif", 2.5, 1100.0, 26.5, 2026, 38.0, 95.0),
        ]
        pred_insert = """
        INSERT INTO prediction_history (
            user_email, crop, district, season, area, rainfall, temperature, crop_year, productivity, production
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        for p_tuple in sample_preds:
            try:
                if engine == "mysql":
                    cursor.execute(pred_insert.replace("?", "%s"), p_tuple)
                else:
                    cursor.execute(pred_insert, p_tuple)
            except Exception as ex:
                print(f"[DB WARN in pred seed]: {ex}")

        if engine == "sqlite":
            conn.commit()
        print("[DATABASE] Initial predictions seeding complete.")

    # 4. Seed Initial Recommendations if table is empty
    cursor.execute("SELECT COUNT(*) FROM recommendation_history")
    rec_row = cursor.fetchone()
    rec_count = _extract_count(rec_row)
    if rec_count == 0:
        sample_recs = [
            ("ramesh.patil@krushimitra.in", "Sugarcane", 98.4, 90.0, 42.0, 45.0, 29.5, 72.0, 6.8, 850.0),
            ("sunita.deshmukh@krushimitra.in", "Grapes", 96.2, 70.0, 35.0, 50.0, 24.2, 65.0, 6.5, 520.0),
            ("anil.jadhav@krushimitra.in", "Soybean", 97.5, 80.0, 40.0, 40.0, 28.1, 80.0, 6.9, 780.0),
            ("dnyaneshwar.patil@krushimitra.in", "Wheat", 95.1, 85.0, 45.0, 35.0, 22.0, 60.0, 7.1, 480.0),
            ("priya.shinde@krushimitra.in", "Cotton", 99.0, 95.0, 50.0, 40.0, 31.0, 75.0, 7.2, 920.0),
            ("admin@krushimitra.in", "Rice", 98.8, 90.0, 40.0, 40.0, 26.5, 85.0, 6.6, 1100.0),
        ]
        rec_insert = """
        INSERT INTO recommendation_history (
            user_email, crop, confidence, nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        for r_tuple in sample_recs:
            try:
                if engine == "mysql":
                    cursor.execute(rec_insert.replace("?", "%s"), r_tuple)
                else:
                    cursor.execute(rec_insert, r_tuple)
            except Exception as ex:
                print(f"[DB WARN in rec seed]: {ex}")

        if engine == "sqlite":
            conn.commit()
        print("[DATABASE] Initial recommendations seeding complete.")

    # 4. Seed Initial Broadcast Advisories if table is empty
    cursor.execute("SELECT COUNT(*) FROM broadcast_advisories")
    b_res = cursor.fetchone()
    b_count = _extract_count(b_res)
    if b_count == 0:
        sample_broadcasts = [
            (
                "ADV-2026-001",
                "Unseasonal Thunderstorm & Hailstorm Warning for Nashik & Ahmednagar",
                "Severe unseasonal thunderstorm with gusty winds (40-50 km/h) and scattered hailstorms expected over the next 48 hours across North Maharashtra. Farmers are strongly advised to secure harvested onion stocks, delay grape canopy spraying, and clear drainage lines in low-lying orchards.",
                "Critical",
                "Weather Alert",
                "Nashik",
                "Onion, Grapes",
                "Shift harvested crops to covered godowns; inspect field drainage.",
                "District Agriculture Emergency Cell, Nashik",
                1
            ),
            (
                "ADV-2026-002",
                "Fall Armyworm Vigilance Advisory for Kharif Maize & Sugarcane",
                "Incidence of early-stage Fall Armyworm (Spodoptera frugiperda) infestation observed in Western Maharashtra and Marathwada zones. Scouting should be undertaken every 4-5 days.",
                "Warning",
                "Pest & Disease",
                "Pune",
                "Sugarcane, Maize",
                "Install pheromone traps @ 5 per acre & apply Azadirachtin 1500 ppm @ 5ml/L.",
                "Krushi Vigyan Kendra (KVK) Pune",
                1
            ),
            (
                "ADV-2026-003",
                "Statewide Rabi Sowing & Micro-Irrigation 80% Subsidy Open",
                "Maharashtra Agriculture Department announces open portal registration for 80% Drip & Sprinkler Irrigation Subsidies under the PMKSY / MahaDBT framework for all registered farmers.",
                "Advisory",
                "Government Scheme",
                "All",
                "All",
                "Apply online on MahaDBT portal with updated 7/12 land extract and bank passbook.",
                "Maharashtra State Agricultural Department",
                1
            )
        ]
        b_insert = """
        INSERT INTO broadcast_advisories (
            broadcast_id, title, message, severity, category, district, crop,
            action_recommendation, created_by, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        for b_tuple in sample_broadcasts:
            try:
                if engine == "mysql":
                    cursor.execute(b_insert.replace("?", "%s"), b_tuple)
                else:
                    cursor.execute(b_insert, b_tuple)
            except Exception as ex:
                print(f"[DB WARN in broadcast seed]: {ex}")

        if engine == "sqlite":
            conn.commit()
        print("[DATABASE] Initial broadcast advisories seeding complete.")

    cursor.close()
    conn.close()

# =========================================================
# USER CRUD OPERATIONS
# =========================================================

def create_user(name, email, password, role="Farmer", district="Pune", phone="", farm_size="5.0"):
    password_hash = generate_password_hash(password)
    member_since = datetime.now().strftime("%B %Y")
    
    # Generate unique Kisan ID (e.g., MH-PUN-392817)
    clean_dist = "".join([c for c in (district or "PUN")[:3].upper() if c.isalnum()]) or "MH"
    kisan_id = f"MH-{clean_dist}-{int(datetime.now().timestamp() * 1000) % 1000000:06d}"
    
    try:
        user_id = execute_insert("""
        INSERT INTO users (name, email, password_hash, role, district, phone, farm_size, kisan_id, member_since)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, email.strip().lower(), password_hash, role, district, phone, farm_size, kisan_id, member_since))
        
        return get_user_by_id(user_id)
    except Exception as e:
        print(f"[DB ERROR in create_user]: {e}")
        return None

def authenticate_user(email, password):
    user = execute_query(
        "SELECT * FROM users WHERE email = ?",
        (email.strip().lower(),),
        fetch_mode="one"
    )
    if user and check_password_hash(user["password_hash"], password):
        return user
    return None

def get_user_by_email(email):
    if not email or not str(email).strip():
        return None
    clean_email = str(email).strip().lower()
    return execute_query(
        "SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(?)",
        (clean_email,),
        fetch_mode="one"
    )


def get_user_by_id(user_id):
    return execute_query(
        "SELECT * FROM users WHERE id = ?",
        (user_id,),
        fetch_mode="one"
    )

def update_user_profile(email, data):
    current = get_user_by_email(email)
    if not current:
        return None

    name = data.get("name") if "name" in data else current.get("name", "")
    phone = data.get("phone") if "phone" in data else current.get("phone", "")
    district = data.get("district") if "district" in data else current.get("district", "")
    state = data.get("state") if "state" in data else current.get("state", "Maharashtra")
    farm_size = data.get("farmSize") if "farmSize" in data else (data.get("farm_size") if "farm_size" in data else current.get("farm_size", ""))
    farm_unit = data.get("farmUnit") if "farmUnit" in data else (data.get("farm_unit") if "farm_unit" in data else current.get("farm_unit", "Acres"))
    soil_type = data.get("soilType") if "soilType" in data else (data.get("soil_type") if "soil_type" in data else current.get("soil_type", ""))
    irrigation_type = data.get("irrigationType") if "irrigationType" in data else (data.get("irrigation_type") if "irrigation_type" in data else current.get("irrigation_type", ""))
    primary_crops = data.get("primaryCrops") if "primaryCrops" in data else (data.get("primary_crops") if "primary_crops" in data else current.get("primary_crops", ""))
    kisan_id = data.get("kisanId") if "kisanId" in data else (data.get("kisan_id") if "kisan_id" in data else current.get("kisan_id", ""))
    farm_details = data.get("farmDetails") if "farmDetails" in data else (data.get("farm_details") if "farm_details" in data else current.get("farm_details", ""))

    execute_query("""
    UPDATE users SET
        name = ?,
        phone = ?,
        district = ?,
        state = ?,
        farm_size = ?,
        farm_unit = ?,
        soil_type = ?,
        irrigation_type = ?,
        primary_crops = ?,
        kisan_id = ?,
        farm_details = ?
    WHERE email = ?
    """, (
        name,
        phone,
        district,
        state,
        farm_size,
        farm_unit,
        soil_type,
        irrigation_type,
        primary_crops,
        kisan_id,
        farm_details,
        email.strip().lower()
    ))
    return get_user_by_email(email)

def change_user_password(email, old_password, new_password):
    user = get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], old_password):
        return False
        
    new_hash = generate_password_hash(new_password)
    execute_query(
        "UPDATE users SET password_hash = ? WHERE email = ?",
        (new_hash, email.strip().lower())
    )
    return True

def get_all_users():
    return execute_query("""
    SELECT id, name, email, phone, role, state, district, farm_size, farm_unit,
           soil_type, irrigation_type, primary_crops, kisan_id, status, member_since, created_at
    FROM users ORDER BY id ASC
    """, fetch_mode="all")

def update_user_role(user_id, new_role):
    return execute_query(
        "UPDATE users SET role = ? WHERE id = ?",
        (new_role, user_id)
    )

def delete_user_by_id(user_id):
    return execute_query(
        "DELETE FROM users WHERE id = ?",
        (user_id,)
    )

# =========================================================
# PREDICTION AND RECOMMENDATION STORAGE
# =========================================================

def save_prediction_record(data):
    record_id = execute_insert("""
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
    return record_id

def get_prediction_history(user_email=None):
    if user_email:
        return execute_query(
            "SELECT * FROM prediction_history WHERE user_email = ? ORDER BY id DESC",
            (user_email.strip().lower(),),
            fetch_mode="all"
        )
    else:
        return execute_query(
            "SELECT * FROM prediction_history ORDER BY id DESC",
            fetch_mode="all"
        )

def save_recommendation_record(data):
    record_id = execute_insert("""
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
    return record_id

def get_recommendation_history(user_email=None):
    if user_email:
        return execute_query(
            "SELECT * FROM recommendation_history WHERE user_email = ? ORDER BY id DESC",
            (user_email.strip().lower(),),
            fetch_mode="all"
        )
    else:
        return execute_query(
            "SELECT * FROM recommendation_history ORDER BY id DESC",
            fetch_mode="all"
        )

# =========================================================
# SUPPORT TICKETS STORAGE
# =========================================================

def save_support_ticket(data):
    ticket_id = data.get("ticket_id") or f"TICK-{int(datetime.now().timestamp()) % 1000000:06d}"
    record_id = execute_insert("""
    INSERT INTO support_tickets (
        ticket_id, user_email, name, district, category, subject, message, status, rating
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        ticket_id,
        data.get("user_email", "guest"),
        data.get("name") or data.get("user_name", "Farmer"),
        data.get("district", "Maharashtra"),
        data.get("category", "General Inquiry"),
        data.get("subject", "General Query"),
        data.get("message", ""),
        data.get("status", "Submitted"),
        int(data.get("rating", 5))
    ))
    return {
        "id": record_id,
        "ticket_id": ticket_id,
        "user_email": data.get("user_email", "guest"),
        "name": data.get("name") or data.get("user_name", "Farmer"),
        "district": data.get("district", "Maharashtra"),
        "category": data.get("category", "General Inquiry"),
        "subject": data.get("subject"),
        "message": data.get("message"),
        "status": "Submitted",
        "rating": int(data.get("rating", 5)),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def get_support_tickets(user_email=None):
    if user_email:
        return execute_query(
            "SELECT * FROM support_tickets WHERE user_email = ? ORDER BY id DESC",
            (user_email.strip().lower(),),
            fetch_mode="all"
        )
    else:
        return execute_query(
            "SELECT * FROM support_tickets ORDER BY id DESC",
            fetch_mode="all"
        )

def update_support_ticket_status(ticket_id, status):
    execute_query(
        "UPDATE support_tickets SET status = ? WHERE ticket_id = ?",
        (status, ticket_id)
    )
    return True

def reply_to_support_ticket(ticket_id, reply_text, status="Resolved"):
    execute_query(
        "UPDATE support_tickets SET admin_reply = ?, status = ? WHERE ticket_id = ?",
        (reply_text, status, ticket_id)
    )
    return True

def delete_support_ticket(ticket_id):
    execute_query(
        "DELETE FROM support_tickets WHERE ticket_id = ?",
        (ticket_id,)
    )
    return True

def purge_sample_tickets():
    sample_ids = ('TICK-102941', 'TICK-203819', 'TICK-309482', 'TICK-408127', 'TICK-501934', 'TICK-TEST999', 'TICK-USERLIVE1')
    placeholders = ','.join(['?'] * len(sample_ids))
    execute_query(f"DELETE FROM support_tickets WHERE ticket_id IN ({placeholders})", sample_ids)
    return len(sample_ids)

def create_user_by_admin(data):
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not password:
        password = "password123"
    role = data.get("role", "Farmer").strip()
    phone = data.get("phone", "").strip()
    district = data.get("district", "").strip()
    farm_size = data.get("farm_size", "").strip()
    farm_unit = data.get("farm_unit", "Acres").strip()
    soil_type = data.get("soil_type", "").strip()
    irrigation_type = data.get("irrigation_type", "").strip()
    primary_crops = data.get("primary_crops", "").strip()
    kisan_id = data.get("kisan_id", "").strip()
    
    existing = get_user_by_email(email)
    if existing:
        return None, "User with this email already exists"
        
    pw_hash = generate_password_hash(password)
    user_id = execute_insert("""
    INSERT INTO users (
        name, email, password_hash, phone, role, district, farm_size, farm_unit,
        soil_type, irrigation_type, primary_crops, kisan_id, status, member_since
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
    """, (
        name, email, pw_hash, phone, role, district, farm_size, farm_unit,
        soil_type, irrigation_type, primary_crops, kisan_id, datetime.now().strftime("%B %Y")
    ))
    
    return user_id, None

def update_user_full_by_admin(user_id, data):
    execute_query("""
    UPDATE users SET
        name = ?,
        email = ?,
        phone = ?,
        role = ?,
        district = ?,
        farm_size = ?,
        farm_unit = ?,
        soil_type = ?,
        irrigation_type = ?,
        primary_crops = ?,
        kisan_id = ?,
        status = ?
    WHERE id = ?
    """, (
        data.get("name"),
        data.get("email", "").strip().lower(),
        data.get("phone", ""),
        data.get("role", "Farmer"),
        data.get("district", "Pune"),
        data.get("farm_size") or data.get("farmSize", "5.0"),
        data.get("farm_unit") or data.get("farmUnit", "Acres"),
        data.get("soil_type") or data.get("soilType", ""),
        data.get("irrigation_type") or data.get("irrigationType", ""),
        data.get("primary_crops") or data.get("primaryCrops", ""),
        data.get("kisan_id") or data.get("kisanId", ""),
        data.get("status", "Active"),
        user_id
    ))
    return get_user_by_id(user_id)

def get_database_export_data():
    users = execute_query("SELECT id, name, email, phone, role, district, farm_size, status, created_at FROM users", fetch_mode="all")
    preds = execute_query("SELECT id, user_email, crop, district, season, area, rainfall, temperature, productivity, production, created_at FROM prediction_history", fetch_mode="all")
    recs = execute_query("SELECT id, user_email, crop, confidence, n_val, p_val, k_val, temperature, humidity, ph, rainfall, created_at FROM recommendation_history", fetch_mode="all")
    tickets = execute_query("SELECT id, ticket_id, user_email, name, category, subject, message, status, created_at FROM support_tickets", fetch_mode="all")
    broadcasts = execute_query("SELECT id, broadcast_id, title, message, severity, category, district, crop, action_recommendation, created_by, is_active, created_at FROM broadcast_advisories", fetch_mode="all")
    return {
        "timestamp": datetime.now().isoformat(),
        "engine": _active_engine,
        "users": users,
        "predictions": preds,
        "recommendations": recs,
        "tickets": tickets,
        "broadcasts": broadcasts
    }

def get_system_stats():
    total_users_res = execute_query("SELECT COUNT(*) AS count FROM users", fetch_mode="one")
    total_farmers_res = execute_query("SELECT COUNT(*) AS count FROM users WHERE role = 'Farmer'", fetch_mode="one")
    total_admins_res = execute_query("SELECT COUNT(*) AS count FROM users WHERE role = 'Admin'", fetch_mode="one")
    total_pred_res = execute_query("SELECT COUNT(*) AS count FROM prediction_history", fetch_mode="one")
    total_rec_res = execute_query("SELECT COUNT(*) AS count FROM recommendation_history", fetch_mode="one")
    total_tickets_res = execute_query("SELECT COUNT(*) AS count FROM support_tickets", fetch_mode="one")
    total_broadcasts_res = execute_query("SELECT COUNT(*) AS count FROM broadcast_advisories WHERE is_active = 1", fetch_mode="one")
    
    engine_name = "MySQL (Active)" if _active_engine == "mysql" else "SQLite 3 (Active)"
    
    return {
        "total_users": total_users_res["count"] if total_users_res else 0,
        "total_farmers": total_farmers_res["count"] if total_farmers_res else 0,
        "total_admins": total_admins_res["count"] if total_admins_res else 0,
        "total_predictions": total_pred_res["count"] if total_pred_res else 0,
        "total_recommendations": total_rec_res["count"] if total_rec_res else 0,
        "total_support_tickets": total_tickets_res["count"] if total_tickets_res else 0,
        "total_broadcasts": total_broadcasts_res["count"] if total_broadcasts_res else 0,
        "db_status": f"{engine_name} Connected",
        "db_engine": _active_engine or "auto",
        "db_file": MYSQL_DB if _active_engine == "mysql" else "krushimitra.db"
    }

# =========================================================
# PASSWORD RESET TOKEN MANAGEMENT
# =========================================================

def create_password_reset_token(email):
    """
    Generates a secure 32-byte URL-safe token valid for 60 minutes.
    Invalidates any previous unused tokens for the user.
    """
    user = get_user_by_email(email)
    if not user:
        return None, None
    
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(hours=1)
    expires_str = expires_at.strftime("%Y-%m-%d %H:%M:%S")
    
    # Invalidate previous unused tokens
    execute_query(
        "UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0",
        (email.strip().lower(),)
    )
    
    execute_insert("""
    INSERT INTO password_resets (email, token, expires_at, used)
    VALUES (?, ?, ?, 0)
    """, (email.strip().lower(), token, expires_str))
    
    return token, user

def verify_password_reset_token(token):
    """
    Validates that the token exists, has not been used, and has not expired.
    Returns the associated user email or None.
    """
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    res = execute_query("""
    SELECT email FROM password_resets 
    WHERE token = ? AND used = 0 AND expires_at > ?
    LIMIT 1
    """, (token.strip(), now_str), fetch_mode="one")
    
    if not res:
        return None
    return res["email"] if isinstance(res, dict) else res[0]

def reset_password_with_token(token, new_password):
    """
    Validates token, securely hashes and updates the user's password, and marks the token as used.
    """
    email = verify_password_reset_token(token)
    if not email:
        return False
    
    new_hash = generate_password_hash(new_password)
    execute_query(
        "UPDATE users SET password_hash = ? WHERE email = ?",
        (new_hash, email)
    )
    
    # Mark token as used
    execute_query(
        "UPDATE password_resets SET used = 1 WHERE token = ?",
        (token.strip(),)
    )
    return True

# =========================================================
# BROADCAST ADVISORY & EMERGENCY ALERT MANAGEMENT
# =========================================================

def create_broadcast_advisory(data):
    """
    Creates a new broadcast advisory in MySQL/SQLite.
    """
    broadcast_id = data.get("broadcast_id") or f"ADV-{datetime.now().strftime('%Y%m%d')}-{secrets.token_hex(3).upper()}"
    title = data.get("title", "").strip()
    message = data.get("message", "").strip()
    severity = data.get("severity", "Warning").strip()
    category = data.get("category", "Weather Alert").strip()
    district = data.get("district", "All").strip()
    crop = data.get("crop", "All").strip()
    action_rec = data.get("action_recommendation", "").strip()
    created_by = data.get("created_by", "KrushiMitra Agriculture Authority").strip()
    
    execute_insert("""
    INSERT INTO broadcast_advisories (
        broadcast_id, title, message, severity, category, district, crop,
        action_recommendation, created_by, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    """, (broadcast_id, title, message, severity, category, district, crop, action_rec, created_by))
    
    return get_broadcast_by_id(broadcast_id)

def get_broadcast_by_id(broadcast_id):
    return execute_query(
        "SELECT * FROM broadcast_advisories WHERE broadcast_id = ? LIMIT 1",
        (broadcast_id,),
        fetch_mode="one"
    )

def get_all_broadcast_advisories():
    return execute_query(
        "SELECT * FROM broadcast_advisories ORDER BY created_at DESC",
        fetch_mode="all"
    )

def get_farmer_broadcast_advisories(district=None, crop=None):
    """
    Retrieves active alerts matching the farmer's district (or 'All').
    """
    if not district or district.strip().lower() in ["all", "maharashtra", ""]:
        return execute_query("""
        SELECT * FROM broadcast_advisories 
        WHERE is_active = 1 
        ORDER BY CASE severity WHEN 'Critical' THEN 1 WHEN 'Warning' THEN 2 ELSE 3 END, created_at DESC
        """, fetch_mode="all")
    
    # Match specific district or All
    return execute_query("""
    SELECT * FROM broadcast_advisories 
    WHERE is_active = 1 AND (LOWER(district) = 'all' OR LOWER(district) = LOWER(?))
    ORDER BY CASE severity WHEN 'Critical' THEN 1 WHEN 'Warning' THEN 2 ELSE 3 END, created_at DESC
    """, (district.strip(),), fetch_mode="all")

def delete_broadcast_advisory(broadcast_id):
    return execute_query(
        "DELETE FROM broadcast_advisories WHERE broadcast_id = ?",
        (broadcast_id,)
    )

def toggle_broadcast_advisory_status(broadcast_id, is_active):
    val = 1 if is_active else 0
    return execute_query(
        "UPDATE broadcast_advisories SET is_active = ? WHERE broadcast_id = ?",
        (val, broadcast_id)
    )


