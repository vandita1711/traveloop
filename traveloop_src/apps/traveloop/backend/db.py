import sqlite3
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
DB_DIR = ROOT_DIR / "data" / "db"
DB_PATH = DB_DIR / "traveloop.db"

def get_db():
    """Open a connection with recommended settings."""
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def init_db():
    """Initialize the database schema."""
    conn = get_db()
    try:
        # Users table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT,
                full_name TEXT,
                profile_photo TEXT
            )
        """)

        # Trips table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                start_date TEXT,
                end_date TEXT,
                description TEXT,
                cover_photo TEXT,
                is_public INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        # Stops table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS stops (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_id INTEGER NOT NULL,
                city_name TEXT NOT NULL,
                arrival_date TEXT,
                departure_date TEXT,
                order_index INTEGER,
                FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
            )
        """)

        # Activities table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stop_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                category TEXT,
                cost REAL DEFAULT 0,
                duration TEXT,
                FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
            )
        """)

        # Budget Items table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS budget_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_id INTEGER NOT NULL,
                category TEXT NOT NULL,
                amount REAL NOT NULL,
                UNIQUE(trip_id, category),
                FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
            )
        """)

        # Packing Items table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS packing_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                category TEXT,
                is_packed INTEGER DEFAULT 0,
                FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
            )
        """)

        # Trip Notes table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS trip_notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_id INTEGER NOT NULL,
                content TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
            )
        """)

        # Seed data if empty
        user_count = conn.execute("SELECT count(*) FROM users").fetchone()[0]
        if user_count == 0:
            conn.execute("INSERT INTO users (email, full_name) VALUES (?, ?)", ("demo@example.com", "Demo User"))
            user_id = 1
            
            # Add a sample trip
            cursor = conn.execute("""
                INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) 
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, "Summer Europe Tour", "2026-07-01", "2026-07-15", "Exploring the best of Italy and France.", "https://images.unsplash.com/photo-1467269204594-9661b134dd2b"))
            trip_id = cursor.lastrowid
            
            # Add stops
            conn.execute("INSERT INTO stops (trip_id, city_name, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?)", 
                         (trip_id, "Rome", "2026-07-01", "2026-07-05", 0))
            conn.execute("INSERT INTO stops (trip_id, city_name, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?)", 
                         (trip_id, "Florence", "2026-07-05", "2026-07-10", 1))
            
            # Add activities
            conn.execute("INSERT INTO activities (stop_id, name, category, cost, duration) VALUES (?, ?, ?, ?, ?)", 
                         (1, "Colosseum Tour", "Sightseeing", 50.0, "3h"))
            conn.execute("INSERT INTO activities (stop_id, name, category, cost, duration) VALUES (?, ?, ?, ?, ?)", 
                         (1, "Pasta Making Class", "Food", 80.0, "4h"))
            
            # Add budget
            conn.execute("INSERT INTO budget_items (trip_id, category, amount) VALUES (?, ?, ?)", (trip_id, "Flights", 1200.0))
            conn.execute("INSERT INTO budget_items (trip_id, category, amount) VALUES (?, ?, ?)", (trip_id, "Accommodation", 2000.0))
            
            # Add packing items
            conn.execute("INSERT INTO packing_items (trip_id, name, category, is_packed) VALUES (?, ?, ?, ?)", (trip_id, "Passport", "Documents", 1))
            conn.execute("INSERT INTO packing_items (trip_id, name, category, is_packed) VALUES (?, ?, ?, ?)", (trip_id, "Sunscreen", "Toiletries", 0))

        conn.commit()
    finally:
        conn.close()
