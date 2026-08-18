#!/usr/bin/env python3
import json
import sys
import warnings

# Suppress DeprecationWarnings from FlightRadarAPI (like the one we saw in testing)
warnings.filterwarnings("ignore", category=DeprecationWarning)

try:
    from FlightRadarAPI import FlightRadar24API
except ImportError:
    # Fallback if someone uses old name
    from FlightRadar24 import FlightRadar24API

def fetch_departures(airport_code="HND"):
    fr_api = FlightRadar24API()
    airport_details = fr_api.get_airport_details(airport_code)
    
    # Check if we got valid data
    if 'airport' not in airport_details or 'pluginData' not in airport_details['airport']:
        print(json.dumps([]))
        return

    departures_data = airport_details['airport']['pluginData']['schedule']['departures']['data']
    
    flights_list = []
    
    for item in departures_data:
        flight = item['flight']
        
        # We only care about flights with schedule times
        schedule_time = flight['time']['scheduled']['departure']
        if not schedule_time:
            continue
            
        estimated_time = flight['time']['estimated']['departure']
        if estimated_time == schedule_time:
            estimated_time = None
        
        destination = flight.get('airport', {}).get('destination')
        if destination:
            dest_name = destination.get('name', '')
            # Try to get city name if available, else use full name or code
            city = destination.get('position', {}).get('region', {}).get('city')
            if not city:
                city = dest_name
            dest_sub = destination.get('code', {}).get('iata', '')
            dest_country = destination.get('position', {}).get('country', {}).get('code', '')
        else:
            city = "Unknown"
            dest_sub = ""
            dest_country = ""
            
        airline = flight['airline']
        if airline:
            airline_name = airline.get('name', '')
            airline_code = airline.get('code', {}).get('iata', '')
        else:
            airline_name = "Unknown"
            airline_code = ""
            
        identification = flight.get('identification') or {}
        number_info = identification.get('number') or {}
        flight_num = number_info.get('default')
        
        codeshares = identification.get('codeshare')
        codeshare_num = codeshares[0] if codeshares and len(codeshares) > 0 else None
        
        # Attempt to get terminal and gate
        origin = flight['airport']['origin']
        if origin and 'info' in origin:
            terminal = origin['info'].get('terminal', '')
            gate = origin['info'].get('gate', '')
        else:
            terminal = ''
            gate = ''
            
        # Determine status
        status_text = "ON TIME"
        if estimated_time and estimated_time > schedule_time + 300: # 5 mins late
            status_text = "DELAYED"
            
        # Map FR24 status
        status_info = flight.get('status') or {}
        fr_status = status_info.get('text') or ''
        if "Boarding" in fr_status:
            status_text = "BOARDING"
        elif "Departed" in fr_status:
            status_text = "DEPARTED"
        elif "Canceled" in fr_status:
            status_text = "CANCELED"
            
        flights_list.append({
            "id": identification.get('id') or flight_num,
            "scheduleTime": schedule_time, # Unix timestamp
            "estimatedTime": estimated_time, # Unix timestamp or None
            "destination": city,
            "destinationSub": dest_sub,
            "destinationCountry": dest_country,
            "airline": {
                "name": airline_name,
                "code": airline_code
            },
            "flightNumber": flight_num,
            "codeshareNumber": codeshare_num,
            "terminal": f"T{terminal}" if terminal else "",
            "gate": gate or "",
            "status": status_text
        })
        
    print(json.dumps(flights_list))

if __name__ == "__main__":
    airport = sys.argv[1] if len(sys.argv) > 1 else "HND"
    fetch_departures(airport)
