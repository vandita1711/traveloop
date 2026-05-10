import sqlite3
import os

DB_PATH = "apps/traveloop/backend/data/db/traveloop.db"

def seed_more_data():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys=ON")
    user_id = 1 # Using existing demo user

    # 1. Add "Tokyo Adventure" - Future trip
    cursor = conn.execute("""
        INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, "Tokyo Adventure", "2026-10-10", "2026-10-20", "Exploring the neon streets and traditional temples of Tokyo.", "./assets/card_photo-tokyo.png"))
    trip_id_tokyo = cursor.lastrowid

    stops = [
        (trip_id_tokyo, "Shinjuku", "2026-10-10", "2026-10-15", 0),
        (trip_id_tokyo, "Asakusa", "2026-10-15", "2026-10-20", 1)
    ]
    conn.executemany("INSERT INTO stops (trip_id, city_name, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?)", stops)
    
    # Get stop IDs
    stop_shinjuku = conn.execute("SELECT id FROM stops WHERE city_name='Shinjuku' AND trip_id=?", (trip_id_tokyo,)).fetchone()[0]
    
    activities = [
        (stop_shinjuku, "Robot Restaurant", "Entertainment", 100.0, "2h"),
        (stop_shinjuku, "Ghibli Museum", "Culture", 15.0, "4h")
    ]
    conn.executemany("INSERT INTO activities (stop_id, name, category, cost, duration) VALUES (?, ?, ?, ?, ?)", activities)

    # 2. Add "Parisian Getaway" - Recent/Past trip
    cursor = conn.execute("""
        INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, "Parisian Getaway", "2026-01-05", "2026-01-12", "A romantic stroll through the City of Light.", "./assets/card_photo-paris.png"))
    trip_id_paris = cursor.lastrowid

    conn.execute("INSERT INTO stops (trip_id, city_name, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?)", 
                 (trip_id_paris, "Paris", "2026-01-05", "2026-01-12", 0))
    stop_paris = conn.execute("SELECT id FROM stops WHERE city_name='Paris' AND trip_id=?", (trip_id_paris,)).fetchone()[0]
    
    conn.execute("INSERT INTO activities (stop_id, name, category, cost, duration) VALUES (?, ?, ?, ?, ?)", 
                 (stop_paris, "Eiffel Tower Visit", "Sightseeing", 25.0, "2h"))

    # 3. Add "Swiss Alps Retreat" - Future trip
    cursor = conn.execute("""
        INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, "Swiss Alps Retreat", "2026-12-20", "2027-01-02", "Winter wonderland and skiing.", "./assets/card_photo-alps.png"))
    trip_id_alps = cursor.lastrowid

    # Budget items for Alps
    budget_items = [
        (trip_id_alps, "Ski Pass", 500.0),
        (trip_id_alps, "Chalet Rental", 1500.0),
        (trip_id_alps, "Transport", 300.0)
    ]
    conn.executemany("INSERT INTO budget_items (trip_id, category, amount) VALUES (?, ?, ?)", budget_items)

    # Packing items for Alps
    packing = [
        (trip_id_alps, "Thermal Wear", "Clothing", 1),
        (trip_id_alps, "Ski Goggles", "Gear", 0),
        (trip_id_alps, "Winter Boots", "Footwear", 1)
    ]
    conn.executemany("INSERT INTO packing_items (trip_id, name, category, is_packed) VALUES (?, ?, ?, ?)", packing)

    conn.commit()
    conn.close()
    print("Sample data added successfully!")

if __name__ == "__main__":
    seed_more_data()
