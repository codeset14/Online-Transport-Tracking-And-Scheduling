import csv
import os
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any, Optional

class CSVHandler:
    """Handler for CSV file operations in the transport tracking system"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.ensure_data_dir()
        
    def ensure_data_dir(self):
        """Ensure the data directory exists"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def get_file_path(self, filename: str) -> str:
        """Get the full path for a CSV file"""
        return os.path.join(self.data_dir, filename)
    
    def read_csv(self, filename: str) -> List[Dict[str, Any]]:
        """Read data from a CSV file"""
        file_path = self.get_file_path(filename)
        
        if not os.path.exists(file_path):
            return []
        
        try:
            with open(file_path, 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                return list(reader)
        except Exception as e:
            print(f"Error reading CSV file {filename}: {e}")
            return []
    
    def write_csv(self, filename: str, data: List[Dict[str, Any]], fieldnames: List[str] = None):
        """Write data to a CSV file"""
        if not data:
            return
        
        file_path = self.get_file_path(filename)
        
        if fieldnames is None:
            fieldnames = list(data[0].keys())
        
        try:
            with open(file_path, 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)
        except Exception as e:
            print(f"Error writing to CSV file {filename}: {e}")
    
    def append_csv(self, filename: str, data: Dict[str, Any]):
        """Append a single row to a CSV file"""
        file_path = self.get_file_path(filename)
        file_exists = os.path.exists(file_path)
        
        try:
            with open(file_path, 'a', newline='', encoding='utf-8') as file:
                fieldnames = list(data.keys())
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                
                # Write header if file doesn't exist
                if not file_exists:
                    writer.writeheader()
                
                writer.writerow(data)
        except Exception as e:
            print(f"Error appending to CSV file {filename}: {e}")
    
    def find_by_field(self, filename: str, field: str, value: Any) -> Optional[Dict[str, Any]]:
        """Find a record by a specific field value"""
        data = self.read_csv(filename)
        for record in data:
            if record.get(field) == str(value):
                return record
        return None
    
    def find_all_by_field(self, filename: str, field: str, value: Any) -> List[Dict[str, Any]]:
        """Find all records matching a specific field value"""
        data = self.read_csv(filename)
        return [record for record in data if record.get(field) == str(value)]
    
    def update_record(self, filename: str, id_field: str, id_value: Any, updates: Dict[str, Any]):
        """Update a record in a CSV file"""
        data = self.read_csv(filename)
        
        for i, record in enumerate(data):
            if record.get(id_field) == str(id_value):
                data[i].update(updates)
                data[i]['updated_at'] = datetime.now().isoformat()
                break
        
        self.write_csv(filename, data)
    
    def delete_record(self, filename: str, id_field: str, id_value: Any):
        """Delete a record from a CSV file"""
        data = self.read_csv(filename)
        data = [record for record in data if record.get(id_field) != str(id_value)]
        self.write_csv(filename, data)
    
    def get_next_id(self, filename: str, id_field: str = 'id') -> str:
        """Get the next available ID for a CSV file"""
        data = self.read_csv(filename)
        if not data:
            return "1"
        
        try:
            max_id = max(int(record.get(id_field, 0)) for record in data)
            return str(max_id + 1)
        except ValueError:
            return str(len(data) + 1)
    
    def backup_csv(self, filename: str):
        """Create a backup of a CSV file"""
        file_path = self.get_file_path(filename)
        if os.path.exists(file_path):
            backup_name = f"{filename.split('.')[0]}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            backup_path = self.get_file_path(backup_name)
            
            try:
                import shutil
                shutil.copy2(file_path, backup_path)
                print(f"Backup created: {backup_name}")
            except Exception as e:
                print(f"Error creating backup: {e}")

# Data models for CSV files
class DataModels:
    """Define the structure for CSV data files"""
    
    USERS_FIELDS = [
        'id', 'username', 'password', 'email', 'phone', 'user_type', 
        'full_name', 'created_at', 'updated_at', 'is_active'
    ]
    
    BUSES_FIELDS = [
        'id', 'bus_number', 'bus_name', 'driver_id', 'route_id', 'capacity',
        'current_location_lat', 'current_location_lng', 'status', 'created_at', 'updated_at'
    ]
    
    ROUTES_FIELDS = [
        'id', 'route_name', 'source', 'destination', 'distance_km', 
        'estimated_duration_min', 'fare', 'stops', 'created_at', 'updated_at'
    ]
    
    BOOKINGS_FIELDS = [
        'id', 'user_id', 'bus_id', 'route_id', 'seat_number', 'booking_date',
        'travel_date', 'fare', 'status', 'payment_status', 'created_at', 'updated_at'
    ]
    
    TRACKING_FIELDS = [
        'id', 'bus_id', 'latitude', 'longitude', 'speed', 'direction',
        'timestamp', 'driver_id', 'route_id', 'created_at'
    ]

# Helper functions
def get_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat()

def generate_booking_id() -> str:
    """Generate a unique booking ID"""
    return f"TTS{datetime.now().strftime('%Y%m%d%H%M%S')}"