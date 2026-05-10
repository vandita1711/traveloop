import importlib
import sqlite3
import sys
import json
from datetime import datetime
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[3]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from apps.traveloop.backend.db import get_db, init_db

# Initialize database on module load
init_db()

def get_dashboard_data(user_id: int = 1):
    print(f"[BACKEND_START] get_dashboard_data for user_id={user_id}")
    conn = get_db()
    try:
        # Get all trips
        trips_rows = conn.execute("SELECT * FROM trips WHERE user_id = ? ORDER BY start_date ASC", (user_id,)).fetchall()
        trips = [dict(r) for r in trips_rows]
        
        now = datetime.now().isoformat()
        upcoming = [t for t in trips if t['start_date'] >= now[:10]]
        recent = sorted(
            [t for t in trips if t['start_date'] < now[:10]],
            key=lambda t: t['start_date'],
            reverse=True
        )[:5]
        
        # Stats
        total_trips = len(trips)
        cities_count = conn.execute("""
            SELECT count(DISTINCT city_name) FROM stops 
            JOIN trips ON stops.trip_id = trips.id 
            WHERE trips.user_id = ?
        """, (user_id,)).fetchone()[0]
        
        result = {
            "upcoming_trips": upcoming,
            "recent_trips": recent,
            "stats": {
                "total_trips": total_trips,
                "total_cities": cities_count
            }
        }
        print(f"[BACKEND_SUCCESS] get_dashboard_data success")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_dashboard_data failed: {str(e)}")
        raise
    finally:
        conn.close()

def create_trip(name: str, start_date: str, end_date: str, description: str, user_id: int = 1):
    print(f"[BACKEND_START] create_trip name={name}")
    conn = get_db()
    try:
        cursor = conn.execute("""
            INSERT INTO trips (user_id, name, start_date, end_date, description)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, name, start_date, end_date, description))
        conn.commit()
        trip_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
        print(f"[BACKEND_SUCCESS] create_trip id={trip_id}")
        return dict(row)
    except Exception as e:
        print(f"[BACKEND_ERROR] create_trip failed: {str(e)}")
        raise
    finally:
        conn.close()

def get_trips(user_id: int = 1):
    print(f"[BACKEND_START] get_trips for user_id={user_id}")
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM trips WHERE user_id = ? ORDER BY start_date DESC", (user_id,)).fetchall()
        result = [dict(r) for r in rows]
        print(f"[BACKEND_SUCCESS] returning {len(result)} trips")
        return result
    finally:
        conn.close()

def get_trip_details(trip_id: int):
    print(f"[BACKEND_START] get_trip_details for trip_id={trip_id}")
    conn = get_db()
    try:
        trip = conn.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
        if not trip:
            print(f"[BACKEND_ERROR] trip {trip_id} not found")
            return None
        
        trip_dict = dict(trip)
        
        # Stops and activities
        stops_rows = conn.execute("SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC", (trip_id,)).fetchall()
        stops = []
        for s in stops_rows:
            stop_dict = dict(s)
            activities_rows = conn.execute("SELECT * FROM activities WHERE stop_id = ?", (s['id'],)).fetchall()
            stop_dict['activities'] = [dict(a) for a in activities_rows]
            stops.append(stop_dict)
        
        trip_dict['stops'] = stops
        
        # Budget
        budget_rows = conn.execute("SELECT * FROM budget_items WHERE trip_id = ?", (trip_id,)).fetchall()
        trip_dict['budget'] = [dict(b) for b in budget_rows]
        
        # Packing
        packing_rows = conn.execute("SELECT * FROM packing_items WHERE trip_id = ?", (trip_id,)).fetchall()
        trip_dict['packing_list'] = [dict(p) for p in packing_rows]
        
        # Notes
        notes_rows = conn.execute("SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC", (trip_id,)).fetchall()
        trip_dict['notes'] = [dict(n) for n in notes_rows]
        
        print(f"[BACKEND_SUCCESS] get_trip_details success")
        return trip_dict
    finally:
        conn.close()

def add_stop(trip_id: int, city_name: str, arrival_date: str, departure_date: str, order_index: int):
    print(f"[BACKEND_START] add_stop trip_id={trip_id}, city={city_name}")
    conn = get_db()
    try:
        cursor = conn.execute("""
            INSERT INTO stops (trip_id, city_name, arrival_date, departure_date, order_index)
            VALUES (?, ?, ?, ?, ?)
        """, (trip_id, city_name, arrival_date, departure_date, order_index))
        conn.commit()
        row = conn.execute("SELECT * FROM stops WHERE id = ?", (cursor.lastrowid,)).fetchone()
        print(f"[BACKEND_SUCCESS] add_stop success")
        return dict(row)
    finally:
        conn.close()

def add_activity(stop_id: int, name: str, category: str, cost: float, duration: str):
    print(f"[BACKEND_START] add_activity stop_id={stop_id}, name={name}")
    conn = get_db()
    try:
        cursor = conn.execute("""
            INSERT INTO activities (stop_id, name, category, cost, duration)
            VALUES (?, ?, ?, ?, ?)
        """, (stop_id, name, category, cost, duration))
        conn.commit()
        row = conn.execute("SELECT * FROM activities WHERE id = ?", (cursor.lastrowid,)).fetchone()
        print(f"[BACKEND_SUCCESS] add_activity success")
        return dict(row)
    finally:
        conn.close()

def update_budget_item(trip_id: int, category: str, amount: float):
    print(f"[BACKEND_START] update_budget_item trip_id={trip_id}, cat={category}")
    conn = get_db()
    try:
        conn.execute("""
            INSERT INTO budget_items (trip_id, category, amount)
            VALUES (?, ?, ?)
            ON CONFLICT(trip_id, category) DO UPDATE SET amount=excluded.amount
        """, (trip_id, category, amount))
        conn.commit()
        row = conn.execute("SELECT * FROM budget_items WHERE trip_id = ? AND category = ?", (trip_id, category)).fetchone()
        print(f"[BACKEND_SUCCESS] update_budget_item success")
        return dict(row)
    finally:
        conn.close()

def toggle_packing_item(item_id: int):
    print(f"[BACKEND_START] toggle_packing_item item_id={item_id}")
    conn = get_db()
    try:
        conn.execute("UPDATE packing_items SET is_packed = 1 - is_packed WHERE id = ?", (item_id,))
        conn.commit()
        row = conn.execute("SELECT * FROM packing_items WHERE id = ?", (item_id,)).fetchone()
        print(f"[BACKEND_SUCCESS] toggle_packing_item success")
        return dict(row)
    finally:
        conn.close()

def add_note(trip_id: int, content: str):
    print(f"[BACKEND_START] add_note trip_id={trip_id}")
    conn = get_db()
    try:
        cursor = conn.execute("INSERT INTO trip_notes (trip_id, content) VALUES (?, ?)", (trip_id, content))
        conn.commit()
        row = conn.execute("SELECT * FROM trip_notes WHERE id = ?", (cursor.lastrowid,)).fetchone()
        print(f"[BACKEND_SUCCESS] add_note success")
        return dict(row)
    finally:
        conn.close()

def search_cities(query: str):
    print(f"[BACKEND_START] search_cities query={query}")
    # Mock data as requested
    cities = [
        {"id": 1, "name": "Paris", "country": "France", "photo": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"},
        {"id": 2, "name": "Tokyo", "country": "Japan", "photo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"},
        {"id": 3, "name": "New York", "country": "USA", "photo": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"},
        {"id": 4, "name": "London", "country": "UK", "photo": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad"},
        {"id": 5, "name": "Barcelona", "country": "Spain", "photo": "https://images.unsplash.com/photo-1583422409516-2895a77efded"},
        {"id": 6, "name": "Rome", "country": "Italy", "photo": "https://images.unsplash.com/photo-1552832230-c0197dd311b5"},
        {"id": 7, "name": "Dubai", "country": "UAE", "photo": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"},
        {"id": 8, "name": "Sydney", "country": "Australia", "photo": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9"},
    ]
    if query:
        results = [c for c in cities if query.lower() in c['name'].lower() or query.lower() in c['country'].lower()]
    else:
        results = cities[:5]
    
    print(f"[BACKEND_SUCCESS] returning {len(results)} cities")
    return results


def create_app():
    try:
        from flask import Flask, request, jsonify, make_response
    except ImportError as exc:
        raise RuntimeError(
            "Flask is required to run the local backend server. Install it with 'pip install -r requirements.txt'"
        ) from exc

    app = Flask(__name__)

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    @app.route("/rpc", methods=["OPTIONS"])
    def handle_options():
        response = make_response("", 204)
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    @app.route("/rpc", methods=["POST"])
    def rpc_endpoint():
        payload = request.get_json(silent=True)
        if not payload:
            return jsonify({"error": "Invalid JSON payload"}), 400

        func_name = payload.get("func")
        args = payload.get("args", {}) or {}
        module_name = payload.get("module")

        if not func_name:
            return jsonify({"error": "Missing required field 'func'"}), 400

        if module_name and module_name != __name__:
            try:
                module = importlib.import_module(module_name)
            except ImportError:
                return jsonify({"error": f"Module '{module_name}' not found"}), 404
        else:
            module = sys.modules[__name__]

        func = getattr(module, func_name, None)
        if not callable(func):
            return jsonify({"error": f"Function '{func_name}' not found"}), 404

        try:
            result = func(**args)
            return jsonify(result)
        except Exception as err:
            return jsonify({"error": str(err)}), 500

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    backend_app = create_app()
    backend_app.run(host="0.0.0.0", port=8000, debug=True)
