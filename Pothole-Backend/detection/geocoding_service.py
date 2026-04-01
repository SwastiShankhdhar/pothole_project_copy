"""
geocoding_service.py
-------------------
Handles reverse geocoding using Google Maps API
"""
import os
import googlemaps
from django.conf import settings

# Initialize Google Maps client
gmaps = None

def get_geocoding_service():
    """Singleton pattern for Google Maps client"""
    global gmaps
    if gmaps is None:
        api_key = os.getenv('GOOGLE_MAPS_API_KEY', '')
        if api_key:
            gmaps = googlemaps.Client(key=api_key)
            print("✅ Google Maps client initialized")
        else:
            print("⚠️ No Google Maps API key found. Geocoding disabled.")
    return gmaps


def reverse_geocode(latitude, longitude):
    """
    Convert coordinates to human-readable address
    
    Args:
        latitude (float): Latitude coordinate
        longitude (float): Longitude coordinate
    
    Returns:
        str: Formatted address or None if failed
    """
    if not latitude or not longitude:
        return None
    
    client = get_geocoding_service()
    if not client:
        return None
    
    try:
        result = client.reverse_geocode((latitude, longitude))
        if result:
            return result[0].get('formatted_address', '')
    except Exception as e:
        print(f"Geocoding error: {e}")
    
    return None


def calculate_severity(confidence, bbox_area=None):
    """
    Calculate severity based on detection confidence and size
    
    Args:
        confidence (float): Detection confidence (0-1)
        bbox_area (float): Area of bounding box (optional)
    
    Returns:
        str: Severity level (low, medium, high, critical)
    """
    if confidence > 0.85:
        if bbox_area and bbox_area > 5000:
            return 'critical'
        return 'high'
    elif confidence > 0.7:
        return 'medium'
    else:
        return 'low'
