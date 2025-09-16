#!/usr/bin/env python3
"""
Transport Tracking System Backend
Startup script for running the Flask API server
"""

import os
import sys
import argparse
from app import app
from config import get_config

def main():
    """Main function to run the Flask app"""
    parser = argparse.ArgumentParser(description='Transport Tracking System Backend')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=5000, help='Port to bind to (default: 5000)')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    parser.add_argument('--env', choices=['development', 'production', 'testing'], 
                       default='development', help='Environment to run in')
    
    args = parser.parse_args()
    
    # Set environment
    os.environ['FLASK_ENV'] = args.env
    
    # Get configuration
    config_class = get_config()
    app.config.from_object(config_class)
    
    # Override with command line arguments
    host = args.host
    port = args.port
    debug = args.debug or config_class.DEBUG
    
    print("="*50)
    print("Transport Tracking System Backend")
    print("="*50)
    print(f"Environment: {args.env}")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Debug: {debug}")
    print(f"Data Directory: {config_class.DATA_DIR}")
    print("="*50)
    print("API Endpoints:")
    print("  - Health Check: http://localhost:5000/api/health")
    print("  - User Registration: POST http://localhost:5000/api/auth/register")
    print("  - User Login: POST http://localhost:5000/api/auth/login")
    print("  - Search Buses: GET http://localhost:5000/api/search/buses?source=X&destination=Y")
    print("  - Create Booking: POST http://localhost:5000/api/bookings")
    print("  - Get User Bookings: GET http://localhost:5000/api/bookings/user/{user_id}")
    print("  - Track Bus: GET http://localhost:5000/api/tracking/{bus_id}")
    print("="*50)
    
    # Create data directory if it doesn't exist
    if not os.path.exists(config_class.DATA_DIR):
        os.makedirs(config_class.DATA_DIR)
        print(f"Created data directory: {config_class.DATA_DIR}")
    
    try:
        # Run the Flask app
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()