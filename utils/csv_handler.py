import csv
import os
from models import User, Driver, Admin, Bus, Booking

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def safe_path(filename):
    return os.path.normpath(os.path.join(BASE_DIR, "../data", filename))

class CSVHandler:
    def __init__(self):
        self.user_file = safe_path("users.csv")
        self.driver_file = safe_path("drivers.csv")
        self.admin_file = safe_path("admins.csv")
        self.bus_file = safe_path("buses.csv")
        self.booking_file = safe_path("bookings.csv")
        self.route_file = safe_path("routes.csv")
        self.tracking_file = safe_path("tracking.csv")

    # ---------- UTILITY ----------
    def clean_row(self, row):
        return {k.strip(): v.strip() for k, v in row.items()}

    # ---------- USERS ----------
    def get_user_by_email(self, email):
        try:
            with open(self.user_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row.get('email') == email:
                        return row
            return None
        except Exception as e:
            print(f"[ERROR] get_user_by_email: {e}")
            return None

    # ---------- DRIVERS ----------
    def get_driver_by_email(self, email):
        try:
            with open(self.driver_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row.get('email') == email:
                        return row
            return None
        except Exception as e:
            print(f"[ERROR] get_driver_by_email: {e}")
            return None

    def verify_driver_login(self, email, password):
        """Plain-text password login."""
        driver = self.get_driver_by_email(email)
        if not driver:
            return None
        if password != driver['password']:
            return None
        return driver

    # ---------- ADMINS ----------
    def get_admin_by_email(self, email):
        try:
            with open(self.admin_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row.get('email') == email:
                        return row
            return None
        except Exception as e:
            print(f"[ERROR] get_admin_by_email: {e}")
            return None

    def verify_admin_login(self, email, password):
        """Plain-text password login."""
        admin = self.get_admin_by_email(email)
        if not admin:
            return None
        if password != admin['password']:
            return None
        return admin

    # ---------- ROUTES ----------
    def get_all_routes(self):
        try:
            with open(self.route_file, newline='') as f:
                return [self.clean_row(row) for row in csv.DictReader(f)]
        except Exception as e:
            print(f"[ERROR] get_all_routes: {e}")
            return []

    def get_route_by_id(self, route_id):
        try:
            with open(self.route_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row.get('id') == route_id:
                        return row
            return None
        except Exception as e:
            print(f"[ERROR] get_route_by_id: {e}")
            return None

    # ---------- BUSES ----------
    def get_all_buses(self):
        try:
            with open(self.bus_file, newline='') as f:
                return [self.clean_row(row) for row in csv.DictReader(f)]
        except Exception as e:
            print(f"[ERROR] get_all_buses: {e}")
            return []

    def get_bus_by_number(self, bus_number):
        try:
            with open(self.bus_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row.get('name') == bus_number:
                        return row
            return None
        except Exception as e:
            print(f"[ERROR] get_bus_by_number: {e}")
            return None

    def search_buses(self, source, destination, date):
        try:
            routes = {}
            with open(self.route_file, newline='') as f:
                for r in csv.DictReader(f):
                    r = self.clean_row(r)
                    routes[r['id']] = r

            result = []
            with open(self.bus_file, newline='') as f:
                for bus in csv.DictReader(f):
                    bus = self.clean_row(bus)
                    route = routes.get(bus['route_id'])
                    if route and route['source'].strip() == source.strip() and route['destination'].strip() == destination.strip():
                        bus['route_name'] = route['route_name']
                        bus['fare'] = route['fare']
                        result.append(bus)
            return result
        except Exception as e:
            print(f"[ERROR] search_buses: {e}")
            return []

    # ---------- BOOKINGS ----------
    def book_bus(self, data):
        booking = {
            'user_id': data['userId'],
            'bus_id': data['busId'],
            'route_id': data['routeId'],
            'seat': data['seat'],
            'date': data['date'],
            'fare': data['fare'],
            'name': f"Bus {data['busId']}"
        }
        try:
            write_header = not os.path.exists(self.booking_file) or os.path.getsize(self.booking_file) == 0
            with open(self.booking_file, 'a', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=booking.keys())
                if write_header:
                    writer.writeheader()
                writer.writerow(booking)
            return booking
        except Exception as e:
            print(f"[ERROR] book_bus: {e}")
            return None

    def cancel_booking(self, bus_id):
        try:
            bookings = []
            with open(self.booking_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row.get('bus_id') != bus_id:
                        bookings.append(row)
            with open(self.booking_file, 'w', newline='') as f:
                if bookings:
                    writer = csv.DictWriter(f, fieldnames=bookings[0].keys())
                    writer.writeheader()
                    writer.writerows(bookings)
        except Exception as e:
            print(f"[ERROR] cancel_booking: {e}")

    # ---------- BUS TRACKING ----------
    def get_bus_tracking(self, bus_number):
        try:
            if not os.path.exists(self.tracking_file):
                print(f"[ERROR] Tracking file not found: {self.tracking_file}")
                return None

            bus_positions = []
            with open(self.tracking_file, newline='') as f:
                for row in csv.DictReader(f):
                    row = self.clean_row(row)
                    if row['bus_id'] == str(bus_number):
                        bus_positions.append({
                            'latitude': float(row['latitude']),
                            'longitude': float(row['longitude']),
                            'speed': float(row['speed']),
                            'direction': float(row['direction']),
                            'timestamp': row['timestamp']
                        })

            if not bus_positions:
                return None

            bus_positions.sort(key=lambda x: x['timestamp'])

            eta = 15

            return {
                'route': bus_positions,
                'latest_position': bus_positions[-1],
                'eta': eta
            }
        except Exception as e:
            print(f"[ERROR] get_bus_tracking: {e}")
            return None
