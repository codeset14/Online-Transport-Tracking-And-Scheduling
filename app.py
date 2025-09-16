from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.csv_handler import CSVHandler

app = Flask(__name__)
CORS(app)  # enable cross-origin requests

csv_handler = CSVHandler()
print("CSV handler initialized")

# ---------------- USER LOGIN ----------------
@app.route('/user/login', methods=['POST'])
def user_login():
    data = request.json
    user = csv_handler.get_user_by_email(data['email'])
    if user and data['password'] == user['password']:
        return jsonify({'user': user})
    return jsonify({'message': 'Invalid credentials'}), 401

# ---------------- DRIVER LOGIN ----------------
@app.route("/driver/login", methods=["POST"])
def driver_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    driver = csv_handler.verify_driver_login(email, password)
    if not driver:
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"driver": driver}), 200

# ---------------- ADMIN LOGIN ----------------
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    admin = csv_handler.verify_admin_login(email, password)
    if not admin:
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"admin": admin}), 200

# ---------------- BUSES ----------------
@app.route('/buses', methods=['GET'])
def get_all_buses():
    buses = csv_handler.get_all_buses()
    return jsonify(buses)

@app.route('/buses/<bus_number>', methods=['GET'])
def get_bus(bus_number):
    bus = csv_handler.get_bus_by_number(bus_number)
    if bus:
        return jsonify(bus)
    return jsonify({'message': 'Bus not found'}), 404

@app.route('/buses/search', methods=['GET'])
def search_buses():
    source = request.args.get('source')
    destination = request.args.get('destination')
    date = request.args.get('date')
    if not source or not destination or not date:
        return jsonify({'message': 'source, destination, and date are required'}), 400
    results = csv_handler.search_buses(source, destination, date)
    return jsonify(results)

# ---------------- BOOKINGS ----------------
@app.route('/bookings', methods=['POST'])
def book_bus():
    data = request.json
    booking = csv_handler.book_bus(data)
    return jsonify(booking)

@app.route('/bookings/<bus_id>', methods=['DELETE'])
def cancel_booking(bus_id):
    csv_handler.cancel_booking(bus_id)
    return jsonify({'message': 'Booking canceled'})

# ---------------- BUS TRACKING ----------------
@app.route('/tracking/<bus_number>', methods=['GET'])
def bus_tracking(bus_number):
    tracking = csv_handler.get_bus_tracking(bus_number)
    return jsonify(tracking)

# ---------------- ROUTES ----------------
@app.route('/routes', methods=['GET'])
def get_all_routes():
    routes = csv_handler.get_all_routes()
    return jsonify(routes)

@app.route('/routes/<route_id>', methods=['GET'])
def get_route(route_id):
    route = csv_handler.get_route_by_id(route_id)
    if route:
        return jsonify(route)
    return jsonify({'message': 'Route not found'}), 404

if __name__ == "__main__":
    print("Starting Transport Tracking System Backend...")
    app.run(host='0.0.0.0', port=5000, debug=True)
