from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import hashlib
import json
import os
import sys
import csv
import logging
from functools import wraps

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Allow all origins for development
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import User, Bus, Route, Booking, BusTracking, UserType, BookingStatus, PaymentStatus, BusStatus
from utils.csv_handler import CSVHandler, DataModels, get_timestamp, generate_booking_id

# Initialize CSV handler with error handling
try:
    csv_handler = CSVHandler('data')
    logger.info("CSV handler initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize CSV handler: {str(e)}")
    raise

# Helper functions
def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def authenticate_user(username, password):
    """Authenticate user and return user data if valid"""
    user_data = csv_handler.find_by_field('users.csv', 'username', username)
    if user_data and user_data['password'] == hash_password(password):
        return User.from_dict(user_data)
    return None

def get_route_by_source_destination(source, destination):
    """Find routes by source and destination"""
    routes = csv_handler.read_csv('routes.csv')
    matching_routes = []
    for route_data in routes:
        route = Route.from_dict(route_data)
        if (route.source.lower() == source.lower() and 
            route.destination.lower() == destination.lower()):
            matching_routes.append(route)
    return matching_routes

def check_credentials(filename, email, password):
    with open(filename, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['email'] == email and row['password'] == hash_password(password):
                return True
    return False

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        print("\n=== Registration Attempt ===")
        data = request.get_json()
        print("Registration data received:", data)
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
            
        # Create user object with minimum required fields
        user = User(
            username=data.get('email').split('@')[0],  # Generate username from email
            password=data.get('password'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            user_type=UserType.USER.value,  # Default to regular user
            full_name=data.get('full_name', data.get('email').split('@')[0])  # Use username as fallback
        )
        
        # Validate user data
        validation_errors = user.validate()
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Check if email already exists
        existing_email = csv_handler.find_by_field('users.csv', 'email', user.email)
        if existing_email:
            return jsonify({'error': 'Email already exists'}), 409
            
        # Set default values and hash password
        user.is_active = True
        user.created_at = get_timestamp()
        user.updated_at = get_timestamp()
        user.id = csv_handler.get_next_id('users.csv')
        
        # Hash the password before saving
        user.password = hash_password(user.password)
        
        # Save user to CSV
        user_dict = user.to_dict()
        print("Saving user:", {k: v for k, v in user_dict.items() if k != 'password'})
        csv_handler.append_csv('users.csv', user_dict)
        
        # Return success without password
        user_response = user_dict.copy()
        user_response.pop('password')
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user_response
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        # Debug prints
        print("\n=== Login Attempt ===")
        print("Login attempt received")
        data = request.get_json()
        print("Raw login data:", data)
        
        # Check if users.csv exists
        if not os.path.exists('data/users.csv'):
            print("ERROR: users.csv not found!")
            return jsonify({'error': 'User database not found'}), 500
            
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        print(f"Attempting login with email: {email}")
        user_data = csv_handler.find_by_field('users.csv', 'email', email)
        print(f"Found user data: {user_data is not None}")
        
        user = None
        if user_data:
            print("Checking password...")
            hashed_password = hash_password(password)
            if user_data['password'] == hashed_password:
                print("Password match successful")
                user = User.from_dict(user_data)
            else:
                print("Password match failed")
                print(f"Input hash: {hashed_password}")
                print(f"Stored hash: {user_data['password']}")

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 403

        user_response = user.to_dict()
        user_response.pop('password')

        return jsonify({
            'message': 'Login successful',
            'user': user_response
        }, 200)

    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@app.route('/api/auth/driver-login', methods=['POST'])
def driver_login():
    data = request.get_json()
    if check_credentials('data/drivers.csv', data['email'], data['password']):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if check_credentials('data/admins.csv', data['email'], data['password']):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Bus Routes
@app.route('/api/buses', methods=['GET'])
def get_buses():
    """Get all buses or filter by route"""
    try:
        route_id = request.args.get('route_id')
        buses_data = csv_handler.read_csv('buses.csv')
        
        buses = []
        for bus_data in buses_data:
            bus = Bus.from_dict(bus_data)
            if route_id and bus.route_id != route_id:
                continue
            buses.append(bus.to_dict())
        
        return jsonify({'buses': buses}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get buses: {str(e)}'}), 500

@app.route('/api/buses/<bus_id>', methods=['GET'])
def get_bus(bus_id):
    """Get specific bus details"""
    try:
        bus_data = csv_handler.find_by_field('buses.csv', 'id', bus_id)
        if not bus_data:
            return jsonify({'error': 'Bus not found'}), 404
        
        bus = Bus.from_dict(bus_data)
        return jsonify({'bus': bus.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get bus: {str(e)}'}), 500

@app.route('/api/buses', methods=['POST'])
def create_bus():
    """Create a new bus (Admin only)"""
    try:
        data = request.get_json()
        
        # Create bus object
        bus = Bus(
            bus_number=data.get('bus_number', ''),
            bus_name=data.get('bus_name', ''),
            driver_id=data.get('driver_id'),
            route_id=data.get('route_id'),
            capacity=int(data.get('capacity', 0)),
            status=data.get('status', BusStatus.INACTIVE.value)
        )
        
        # Validate bus data
        validation_errors = bus.validate()
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Check if bus number already exists
        existing_bus = csv_handler.find_by_field('buses.csv', 'bus_number', bus.bus_number)
        if existing_bus:
            return jsonify({'error': 'Bus number already exists'}), 409
        
        # Set ID and save
        bus.id = csv_handler.get_next_id('buses.csv')
        csv_handler.append_csv('buses.csv', bus.to_dict())
        
        return jsonify({
            'message': 'Bus created successfully',
            'bus': bus.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Failed to create bus: {str(e)}'}), 500

# Route Routes
@app.route('/api/routes', methods=['GET'])
def get_routes():
    """Get all routes or search by source/destination"""
    try:
        source = request.args.get('source')
        destination = request.args.get('destination')
        
        routes_data = csv_handler.read_csv('routes.csv')
        routes = []
        
        for route_data in routes_data:
            route = Route.from_dict(route_data)
            
            # Filter by source/destination if provided
            if source and route.source.lower() != source.lower():
                continue
            if destination and route.destination.lower() != destination.lower():
                continue
                
            routes.append(route.to_dict())
        
        return jsonify({'routes': routes}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get routes: {str(e)}'}), 500

@app.route('/api/routes', methods=['POST'])
def create_route():
    """Create a new route (Admin only)"""
    try:
        data = request.get_json()
        
        # Create route object
        route = Route(
            route_name=data.get('route_name', ''),
            source=data.get('source', ''),
            destination=data.get('destination', ''),
            distance_km=float(data.get('distance_km', 0)),
            estimated_duration_min=int(data.get('estimated_duration_min', 0)),
            fare=float(data.get('fare', 0)),
            stops=data.get('stops', '')
        )
        
        # Validate route data
        validation_errors = route.validate()
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Set ID and save
        route.id = csv_handler.get_next_id('routes.csv')
        csv_handler.append_csv('routes.csv', route.to_dict())
        
        return jsonify({
            'message': 'Route created successfully',
            'route': route.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Failed to create route: {str(e)}'}), 500

# Booking Routes
@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking"""
    try:
        data = request.get_json()
        
        # Create booking object
        booking = Booking(
            user_id=data.get('user_id', ''),
            bus_id=data.get('bus_id', ''),
            route_id=data.get('route_id', ''),
            seat_number=data.get('seat_number', ''),
            travel_date=data.get('travel_date', ''),
            fare=float(data.get('fare', 0))
        )
        
        # Validate booking data
        validation_errors = booking.validate()
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Check if seat is already booked for the same bus and date
        existing_bookings = csv_handler.read_csv('bookings.csv')
        for existing_booking_data in existing_bookings:
            existing_booking = Booking.from_dict(existing_booking_data)
            if (existing_booking.bus_id == booking.bus_id and 
                existing_booking.travel_date == booking.travel_date and 
                existing_booking.seat_number == booking.seat_number and
                existing_booking.status != BookingStatus.CANCELLED.value):
                return jsonify({'error': 'Seat already booked'}), 409
        
        # Set ID and save
        booking.id = generate_booking_id()
        csv_handler.append_csv('bookings.csv', booking.to_dict())
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Failed to create booking: {str(e)}'}), 500

@app.route('/api/bookings/user/<user_id>', methods=['GET'])
def get_user_bookings(user_id):
    """Get all bookings for a user"""
    try:
        bookings_data = csv_handler.find_all_by_field('bookings.csv', 'user_id', user_id)
        
        bookings = []
        for booking_data in bookings_data:
            booking = Booking.from_dict(booking_data)
            
            # Enrich with route and bus information
            route_data = csv_handler.find_by_field('routes.csv', 'id', booking.route_id)
            bus_data = csv_handler.find_by_field('buses.csv', 'id', booking.bus_id)
            
            booking_dict = booking.to_dict()
            if route_data:
                booking_dict['route_name'] = f"{route_data['source']} to {route_data['destination']}"
                booking_dict['route'] = Route.from_dict(route_data).to_dict()
            if bus_data:
                booking_dict['bus'] = Bus.from_dict(bus_data).to_dict()
            
            bookings.append(booking_dict)
        
        return jsonify({'bookings': bookings}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get bookings: {str(e)}'}), 500

@app.route('/api/bookings/<booking_id>/cancel', methods=['PUT'])
def cancel_booking(booking_id):
    """Cancel a booking"""
    try:
        booking_data = csv_handler.find_by_field('bookings.csv', 'id', booking_id)
        if not booking_data:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Update booking status
        csv_handler.update_record('bookings.csv', 'id', booking_id, {
            'status': BookingStatus.CANCELLED.value,
            'updated_at': get_timestamp()
        })
        
        return jsonify({'message': 'Booking cancelled successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to cancel booking: {str(e)}'}), 500

# Bus Tracking Routes
@app.route('/api/tracking/<bus_id>', methods=['GET'])
def get_bus_tracking(bus_id):
    """Get latest tracking information for a bus"""
    try:
        tracking_data = csv_handler.find_all_by_field('tracking.csv', 'bus_id', bus_id)
        
        if not tracking_data:
            return jsonify({'error': 'No tracking data found'}), 404
        
        # Get the most recent tracking entry
        latest_tracking = max(tracking_data, key=lambda x: x['timestamp'])
        tracking = BusTracking.from_dict(latest_tracking)
        
        return jsonify({'tracking': tracking.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get tracking data: {str(e)}'}), 500

@app.route('/api/tracking', methods=['POST'])
def update_bus_tracking():
    """Update bus tracking information (Driver/Admin only)"""
    try:
        data = request.get_json()
        
        # Create tracking object
        tracking = BusTracking(
            bus_id=data.get('bus_id', ''),
            latitude=float(data.get('latitude', 0)),
            longitude=float(data.get('longitude', 0)),
            speed=float(data.get('speed', 0)),
            direction=float(data.get('direction', 0)),
            driver_id=data.get('driver_id'),
            route_id=data.get('route_id')
        )
        
        # Validate tracking data
        validation_errors = tracking.validate()
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Set ID and save
        tracking.id = csv_handler.get_next_id('tracking.csv')
        csv_handler.append_csv('tracking.csv', tracking.to_dict())
        
        # Update bus location
        csv_handler.update_record('buses.csv', 'id', tracking.bus_id, {
            'current_location_lat': str(tracking.latitude),
            'current_location_lng': str(tracking.longitude),
            'updated_at': get_timestamp()
        })
        
        return jsonify({
            'message': 'Tracking data updated successfully',
            'tracking': tracking.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Failed to update tracking: {str(e)}'}), 500

# Search Routes
@app.route('/api/search/buses', methods=['GET'])
def search_buses():
    """Search for buses by source and destination"""
    try:
        source = request.args.get('source')
        destination = request.args.get('destination')
        travel_date = request.args.get('date')
        
        if not source or not destination:
            return jsonify({'error': 'Source and destination are required'}), 400
        
        # Find matching routes
        routes = get_route_by_source_destination(source, destination)
        if not routes:
            return jsonify({'buses': []}), 200
        
        # Get buses for these routes
        buses = []
        for route in routes:
            route_buses = csv_handler.find_all_by_field('buses.csv', 'route_id', route.id)
            for bus_data in route_buses:
                bus = Bus.from_dict(bus_data)
                if bus.status == BusStatus.ACTIVE.value:
                    bus_dict = bus.to_dict()
                    bus_dict['route'] = route.to_dict()
                    
                    # Calculate available seats
                    if travel_date:
                        booked_seats = csv_handler.read_csv('bookings.csv')
                        booked_count = len([b for b in booked_seats 
                                          if b['bus_id'] == bus.id 
                                          and b['travel_date'] == travel_date
                                          and b['status'] != BookingStatus.CANCELLED.value])
                        bus_dict['available_seats'] = bus.capacity - booked_count
                    else:
                        bus_dict['available_seats'] = bus.capacity
                    
                    buses.append(bus_dict)
        
        return jsonify({'buses': buses}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to search buses: {str(e)}'}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': get_timestamp(),
        'service': 'Transport Tracking System API'
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Transport Tracking System Backend...")
    
    # Configure CORS to allow all origins explicitly
    CORS(app, resources={
        r"/*": {
            "origins": ["*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "supports_credentials": True
        }
    })
    
    # Make sure these prints show up
    print("Server starting on:")
    print("- Local:   http://localhost:5000")
    print("- Network: http://192.168.0.110:5000")
    print("- Android: http://10.0.2.2:5000")
    
    try:
        app.run(
            host='0.0.0.0',      # Allow external connections
            port=5000,
            debug=True,
            use_reloader=True,
            threaded=True
        )
    except Exception as e:
        print(f"Error starting server: {str(e)}")