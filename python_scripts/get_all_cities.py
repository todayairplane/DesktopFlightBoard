import sys
import json
import warnings
from FlightRadarAPI import FlightRadar24API

warnings.filterwarnings("ignore", category=DeprecationWarning)

def get_all_destinations():
    fr_api = FlightRadar24API()
    airports = ["HND", "NRT", "JFK", "ZRH"]
    destinations = set()
    
    for code in airports:
        airport_details = fr_api.get_airport_details(code)
        if 'airport' not in airport_details or 'pluginData' not in airport_details['airport']:
            continue
            
        departures_data = airport_details['airport']['pluginData']['schedule']['departures']['data']
        for item in departures_data:
            flight = item.get('flight')
            if not flight: continue
            
            dest = flight.get('airport', {}).get('destination')
            if dest:
                city = dest.get('position', {}).get('region', {}).get('city')
                if not city:
                    city = dest.get('name', '')
                if city:
                    destinations.add(city)
                    
    print(json.dumps(sorted(list(destinations))))

if __name__ == "__main__":
    get_all_destinations()
