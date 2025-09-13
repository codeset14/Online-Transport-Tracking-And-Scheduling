# Transport Tracking System - Backend

A comprehensive Python Flask backend for the Transport Tracking System that stores data in CSV files. This backend provides RESTful APIs for user authentication, bus management, route management, booking system, and real-time bus tracking.

## Features

- **User Authentication**: Registration and login for users, drivers, and admins
- **Bus Management**: CRUD operations for bus information
- **Route Management**: Create and manage bus routes with stops
- **Booking System**: Seat reservation and booking management
- **Real-time Tracking**: GPS location tracking for buses
- **CSV Data Storage**: All data stored in CSV files for easy management
- **RESTful API**: Clean REST endpoints for frontend integration
- **Input Validation**: Comprehensive data validation and error handling
- **CORS Support**: Cross-origin requests enabled for React Native frontend

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── models.py             # Data models and validation
├── config.py             # Configuration settings
├── run.py                # Startup script
├── requirements.txt      # Python dependencies
├── README.md            # This documentation
├── data/                # CSV data files
│   ├── users.csv        # User accounts
│   ├── buses.csv        # Bus information
│   ├── routes.csv       # Route details
│   ├── bookings.csv     # Booking records
│   └── tracking.csv     # GPS tracking data
└── utils/
    └── csv_handler.py   # CSV file operations
```

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Setup Instructions

1. **Navigate to the backend directory:**
   ```cmd
   cd "C:\Users\Viraj Sawant\Downloads\PostGreSql\backend"
   ```

2. **Create a virtual environment (recommended):**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Run the server:**
   ```cmd
   python run.py
   ```

   Or directly:
   ```cmd
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure123",
  "email": "john@example.com",
  "phone": "+1234567890",
  "full_name": "John Doe",
  "user_type": "user"  // "user", "driver", or "admin"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure123"
}
```

### Bus Endpoints

#### Get All Buses
```http
GET /api/buses
GET /api/buses?route_id=1  // Filter by route
```

#### Get Specific Bus
```http
GET /api/buses/{bus_id}
```

#### Create Bus (Admin Only)
```http
POST /api/buses
Content-Type: application/json

{
  "bus_number": "MH12AB1234",
  "bus_name": "Express 101",
  "driver_id": "2",
  "route_id": "1",
  "capacity": 30,
  "status": "active"
}
```

### Route Endpoints

#### Get All Routes
```http
GET /api/routes
GET /api/routes?source=Mumbai&destination=Pune  // Filter by source/destination
```

#### Create Route (Admin Only)
```http
POST /api/routes
Content-Type: application/json

{
  "route_name": "Mumbai Express",
  "source": "Mumbai",
  "destination": "Pune",
  "distance_km": 150.5,
  "estimated_duration_min": 180,
  "fare": 250,
  "stops": "[\"Lonavala\", \"Khandala\"]"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "user_id": "4",
  "bus_id": "1",
  "route_id": "1",
  "seat_number": "A1",
  "travel_date": "2024-01-15",
  "fare": 250
}
```

#### Get User Bookings
```http
GET /api/bookings/user/{user_id}
```

#### Cancel Booking
```http
PUT /api/bookings/{booking_id}/cancel
```

### Search Endpoints

#### Search Buses
```http
GET /api/search/buses?source=Mumbai&destination=Pune&date=2024-01-15
```

### Tracking Endpoints

#### Get Bus Tracking
```http
GET /api/tracking/{bus_id}
```

#### Update Bus Location (Driver/Admin Only)
```http
POST /api/tracking
Content-Type: application/json

{
  "bus_id": "1",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "speed": 45.5,
  "direction": 90,
  "driver_id": "2",
  "route_id": "1"
}
```

### Health Check
```http
GET /api/health
```

## Data Models

### User
- `id`: Unique identifier
- `username`: Login username
- `password`: Hashed password
- `email`: Email address
- `phone`: Phone number
- `user_type`: "user", "driver", or "admin"
- `full_name`: Full name
- `created_at`: Registration timestamp
- `updated_at`: Last update timestamp
- `is_active`: Account status

### Bus
- `id`: Unique identifier
- `bus_number`: Vehicle registration number
- `bus_name`: Display name
- `driver_id`: Assigned driver
- `route_id`: Assigned route
- `capacity`: Seating capacity
- `current_location_lat`: Current latitude
- `current_location_lng`: Current longitude
- `status`: "active", "inactive", "maintenance", "out_of_service"
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Route
- `id`: Unique identifier
- `route_name`: Route display name
- `source`: Starting point
- `destination`: End point
- `distance_km`: Distance in kilometers
- `estimated_duration_min`: Duration in minutes
- `fare`: Ticket price
- `stops`: JSON array of intermediate stops
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Booking
- `id`: Unique booking ID
- `user_id`: Customer ID
- `bus_id`: Bus ID
- `route_id`: Route ID
- `seat_number`: Reserved seat
- `booking_date`: Booking creation date
- `travel_date`: Travel date
- `fare`: Paid amount
- `status`: "pending", "confirmed", "cancelled", "completed"
- `payment_status`: "pending", "paid", "failed", "refunded"
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Bus Tracking
- `id`: Unique identifier
- `bus_id`: Bus ID
- `latitude`: GPS latitude
- `longitude`: GPS longitude
- `speed`: Current speed
- `direction`: Direction in degrees
- `timestamp`: Location timestamp
- `driver_id`: Driver ID
- `route_id`: Route ID
- `created_at`: Creation timestamp

## Sample Data

The backend comes with sample data for testing:

### Default Users
- **Admin**: username: `admin`, password: `secret123`
- **Driver1**: username: `driver1`, password: `secret123`
- **Driver2**: username: `driver2`, password: `secret123`
- **User1**: username: `user1`, password: `secret123`
- **User2**: username: `user2`, password: `secret123`

### Sample Routes
1. Mumbai to Pune (Express 101)
2. Delhi to Gurgaon (SuperFast 202)
3. Bangalore to Mysore (CityLink 303)
4. Chennai to Pondicherry (Chennai Express)
5. Kolkata to Durgapur (Kolkata Volvo)

## Configuration

The application can be configured using environment variables or by modifying `config.py`:

- `FLASK_ENV`: Environment (development/production/testing)
- `SECRET_KEY`: Flask secret key
- `API_HOST`: Server host (default: 0.0.0.0)
- `API_PORT`: Server port (default: 5000)

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": {
    "field": "Validation error details"
  }
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## CSV File Format

All data is stored in CSV files with headers. The files are automatically created when the server starts. You can manually edit these files for data management, but ensure proper formatting.

## Running in Production

For production deployment:

1. Set environment variables:
   ```cmd
   set FLASK_ENV=production
   set SECRET_KEY=your-production-secret-key
   ```

2. Use a production WSGI server like Gunicorn:
   ```cmd
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## Backup and Data Management

- CSV files are stored in the `data/` directory
- Regular backups are recommended
- Use the CSV handler's backup functionality:
  ```python
  csv_handler.backup_csv('users.csv')
  ```

## Frontend Integration

This backend is designed to work with the React Native frontend. Key integration points:

1. Update frontend API base URL to `http://localhost:5000/api`
2. Use the authentication endpoints for login/register
3. Use search endpoints for bus discovery
4. Use booking endpoints for ticket reservations
5. Use tracking endpoints for real-time bus location

## Troubleshooting

### Common Issues

1. **Port already in use**: Change port in `run.py` or kill the process using port 5000
2. **CSV file not found**: Files are auto-created, but ensure write permissions
3. **CORS errors**: CORS is enabled by default, check frontend URL configuration
4. **Validation errors**: Check API documentation for required fields

### Debug Mode

Run with debug mode for detailed error messages:
```cmd
python run.py --debug
```

## Contributing

1. Follow Python PEP 8 style guidelines
2. Add proper error handling and validation
3. Update documentation for new endpoints
4. Test with sample data before committing

## License

This project is created for educational purposes as part of the Transport Tracking System.

---

**Contact**: For questions or support, please refer to the project documentation or contact the development team.