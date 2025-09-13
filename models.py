from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from datetime import datetime
import re
import hashlib
from enum import Enum

class UserType(Enum):
    USER = "user"
    DRIVER = "driver"
    ADMIN = "admin"

class BookingStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class BusStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    OUT_OF_SERVICE = "out_of_service"

@dataclass
class User:
    """User model for the transport tracking system"""
    id: Optional[str] = None
    username: str = ""
    password: str = ""
    email: str = ""
    phone: str = ""
    user_type: str = UserType.USER.value
    full_name: str = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    is_active: bool = True
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
        if self.updated_at is None:
            self.updated_at = datetime.now().isoformat()
    
    def validate(self) -> Dict[str, str]:
        """Validate user data and return errors"""
        errors = {}
        
        if not self.username or len(self.username) < 3:
            errors['username'] = 'Username must be at least 3 characters long'
        
        if not self.password or len(self.password) < 6:
            errors['password'] = 'Password must be at least 6 characters long'
        
        if not self.email or not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', self.email):
            errors['email'] = 'Invalid email format'
        
        if not self.phone or not re.match(r'^\+?1?-?\d{10}$', self.phone.replace(' ', '')):
            errors['phone'] = 'Invalid phone number format'
        
        if not self.full_name or len(self.full_name) < 2:
            errors['full_name'] = 'Full name must be at least 2 characters long'
        
        if self.user_type not in [e.value for e in UserType]:
            errors['user_type'] = 'Invalid user type'
        
        return errors
    
    def hash_password(self):
        """Hash the user's password"""
        self.password = hashlib.sha256(self.password.encode()).hexdigest()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary for CSV storage"""
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'email': self.email,
            'phone': self.phone,
            'user_type': self.user_type,
            'full_name': self.full_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'is_active': str(self.is_active)
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create user from dictionary"""
        return cls(
            id=data.get('id'),
            username=data.get('username', ''),
            password=data.get('password', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            user_type=data.get('user_type', UserType.USER.value),
            full_name=data.get('full_name', ''),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at'),
            is_active=data.get('is_active', 'True').lower() == 'true'
        )

@dataclass
class Route:
    """Route model for bus routes"""
    id: Optional[str] = None
    route_name: str = ""
    source: str = ""
    destination: str = ""
    distance_km: float = 0.0
    estimated_duration_min: int = 0
    fare: float = 0.0
    stops: str = ""  # JSON string of stops
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
        if self.updated_at is None:
            self.updated_at = datetime.now().isoformat()
    
    def validate(self) -> Dict[str, str]:
        """Validate route data and return errors"""
        errors = {}
        
        if not self.route_name or len(self.route_name) < 3:
            errors['route_name'] = 'Route name must be at least 3 characters long'
        
        if not self.source or len(self.source) < 2:
            errors['source'] = 'Source must be at least 2 characters long'
        
        if not self.destination or len(self.destination) < 2:
            errors['destination'] = 'Destination must be at least 2 characters long'
        
        if self.distance_km <= 0:
            errors['distance_km'] = 'Distance must be greater than 0'
        
        if self.estimated_duration_min <= 0:
            errors['estimated_duration_min'] = 'Duration must be greater than 0'
        
        if self.fare <= 0:
            errors['fare'] = 'Fare must be greater than 0'
        
        return errors
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert route to dictionary for CSV storage"""
        return {
            'id': self.id,
            'route_name': self.route_name,
            'source': self.source,
            'destination': self.destination,
            'distance_km': str(self.distance_km),
            'estimated_duration_min': str(self.estimated_duration_min),
            'fare': str(self.fare),
            'stops': self.stops,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Route':
        """Create route from dictionary"""
        return cls(
            id=data.get('id'),
            route_name=data.get('route_name', ''),
            source=data.get('source', ''),
            destination=data.get('destination', ''),
            distance_km=float(data.get('distance_km', 0)),
            estimated_duration_min=int(data.get('estimated_duration_min', 0)),
            fare=float(data.get('fare', 0)),
            stops=data.get('stops', ''),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )

@dataclass
class Bus:
    """Bus model for the transport tracking system"""
    id: Optional[str] = None
    bus_number: str = ""
    bus_name: str = ""
    driver_id: Optional[str] = None
    route_id: Optional[str] = None
    capacity: int = 0
    current_location_lat: float = 0.0
    current_location_lng: float = 0.0
    status: str = BusStatus.INACTIVE.value
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
        if self.updated_at is None:
            self.updated_at = datetime.now().isoformat()
    
    def validate(self) -> Dict[str, str]:
        """Validate bus data and return errors"""
        errors = {}
        
        if not self.bus_number or len(self.bus_number) < 3:
            errors['bus_number'] = 'Bus number must be at least 3 characters long'
        
        if not self.bus_name or len(self.bus_name) < 3:
            errors['bus_name'] = 'Bus name must be at least 3 characters long'
        
        if self.capacity <= 0 or self.capacity > 100:
            errors['capacity'] = 'Capacity must be between 1 and 100'
        
        if self.status not in [e.value for e in BusStatus]:
            errors['status'] = 'Invalid bus status'
        
        return errors
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert bus to dictionary for CSV storage"""
        return {
            'id': self.id,
            'bus_number': self.bus_number,
            'bus_name': self.bus_name,
            'driver_id': self.driver_id,
            'route_id': self.route_id,
            'capacity': str(self.capacity),
            'current_location_lat': str(self.current_location_lat),
            'current_location_lng': str(self.current_location_lng),
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Bus':
        """Create bus from dictionary"""
        return cls(
            id=data.get('id'),
            bus_number=data.get('bus_number', ''),
            bus_name=data.get('bus_name', ''),
            driver_id=data.get('driver_id'),
            route_id=data.get('route_id'),
            capacity=int(data.get('capacity', 0)),
            current_location_lat=float(data.get('current_location_lat', 0)),
            current_location_lng=float(data.get('current_location_lng', 0)),
            status=data.get('status', BusStatus.INACTIVE.value),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )

@dataclass
class Booking:
    """Booking model for ticket reservations"""
    id: Optional[str] = None
    user_id: str = ""
    bus_id: str = ""
    route_id: str = ""
    seat_number: str = ""
    booking_date: Optional[str] = None
    travel_date: str = ""
    fare: float = 0.0
    status: str = BookingStatus.PENDING.value
    payment_status: str = PaymentStatus.PENDING.value
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
        if self.updated_at is None:
            self.updated_at = datetime.now().isoformat()
        if self.booking_date is None:
            self.booking_date = datetime.now().date().isoformat()
    
    def validate(self) -> Dict[str, str]:
        """Validate booking data and return errors"""
        errors = {}
        
        if not self.user_id:
            errors['user_id'] = 'User ID is required'
        
        if not self.bus_id:
            errors['bus_id'] = 'Bus ID is required'
        
        if not self.route_id:
            errors['route_id'] = 'Route ID is required'
        
        if not self.seat_number:
            errors['seat_number'] = 'Seat number is required'
        
        if not self.travel_date:
            errors['travel_date'] = 'Travel date is required'
        
        if self.fare <= 0:
            errors['fare'] = 'Fare must be greater than 0'
        
        if self.status not in [e.value for e in BookingStatus]:
            errors['status'] = 'Invalid booking status'
        
        if self.payment_status not in [e.value for e in PaymentStatus]:
            errors['payment_status'] = 'Invalid payment status'
        
        return errors
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert booking to dictionary for CSV storage"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bus_id': self.bus_id,
            'route_id': self.route_id,
            'seat_number': self.seat_number,
            'booking_date': self.booking_date,
            'travel_date': self.travel_date,
            'fare': str(self.fare),
            'status': self.status,
            'payment_status': self.payment_status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Booking':
        """Create booking from dictionary"""
        return cls(
            id=data.get('id'),
            user_id=data.get('user_id', ''),
            bus_id=data.get('bus_id', ''),
            route_id=data.get('route_id', ''),
            seat_number=data.get('seat_number', ''),
            booking_date=data.get('booking_date'),
            travel_date=data.get('travel_date', ''),
            fare=float(data.get('fare', 0)),
            status=data.get('status', BookingStatus.PENDING.value),
            payment_status=data.get('payment_status', PaymentStatus.PENDING.value),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at')
        )

@dataclass
class BusTracking:
    """Bus tracking model for real-time location updates"""
    id: Optional[str] = None
    bus_id: str = ""
    latitude: float = 0.0
    longitude: float = 0.0
    speed: float = 0.0
    direction: float = 0.0
    timestamp: Optional[str] = None
    driver_id: Optional[str] = None
    route_id: Optional[str] = None
    created_at: Optional[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()
    
    def validate(self) -> Dict[str, str]:
        """Validate tracking data and return errors"""
        errors = {}
        
        if not self.bus_id:
            errors['bus_id'] = 'Bus ID is required'
        
        if not (-90 <= self.latitude <= 90):
            errors['latitude'] = 'Latitude must be between -90 and 90'
        
        if not (-180 <= self.longitude <= 180):
            errors['longitude'] = 'Longitude must be between -180 and 180'
        
        if self.speed < 0:
            errors['speed'] = 'Speed cannot be negative'
        
        if not (0 <= self.direction < 360):
            errors['direction'] = 'Direction must be between 0 and 360'
        
        return errors
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert tracking to dictionary for CSV storage"""
        return {
            'id': self.id,
            'bus_id': self.bus_id,
            'latitude': str(self.latitude),
            'longitude': str(self.longitude),
            'speed': str(self.speed),
            'direction': str(self.direction),
            'timestamp': self.timestamp,
            'driver_id': self.driver_id,
            'route_id': self.route_id,
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BusTracking':
        """Create tracking from dictionary"""
        return cls(
            id=data.get('id'),
            bus_id=data.get('bus_id', ''),
            latitude=float(data.get('latitude', 0)),
            longitude=float(data.get('longitude', 0)),
            speed=float(data.get('speed', 0)),
            direction=float(data.get('direction', 0)),
            timestamp=data.get('timestamp'),
            driver_id=data.get('driver_id'),
            route_id=data.get('route_id'),
            created_at=data.get('created_at')
        )