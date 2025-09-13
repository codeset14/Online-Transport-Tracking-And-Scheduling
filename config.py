import os
from datetime import timedelta

class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'transport-tracking-system-secret-key-2024'
    DEBUG = True
    TESTING = False
    
    # API settings
    API_HOST = '0.0.0.0'
    API_PORT = 5000
    API_PREFIX = '/api'
    
    # CSV Data settings
    DATA_DIR = 'data'
    BACKUP_DIR = 'backups'
    
    # CSV file names
    USERS_FILE = 'users.csv'
    BUSES_FILE = 'buses.csv'
    ROUTES_FILE = 'routes.csv'
    BOOKINGS_FILE = 'bookings.csv'
    TRACKING_FILE = 'tracking.csv'
    
    # Pagination settings
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # Security settings
    PASSWORD_MIN_LENGTH = 6
    USERNAME_MIN_LENGTH = 3
    
    # Business logic settings
    DEFAULT_BUS_CAPACITY = 30
    MAX_BUS_CAPACITY = 100
    BOOKING_EXPIRY_HOURS = 24
    
    # Tracking settings
    TRACKING_UPDATE_INTERVAL = 30  # seconds
    MAX_TRACKING_RECORDS_PER_BUS = 1000
    
    # CORS settings
    CORS_ORIGINS = ["*"]  # Allow all origins in development
    
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # Override with environment variables in production
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'production-secret-key-change-this'
    API_HOST = os.environ.get('API_HOST') or '0.0.0.0'
    API_PORT = int(os.environ.get('API_PORT', 5000))
    
    # Restrict CORS in production
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '').split(',') if os.environ.get('CORS_ORIGINS') else ["http://localhost:19006"]

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    
    # Use separate test data directory
    DATA_DIR = 'test_data'
    
# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'default')
    return config.get(env, config['default'])