import json
from FlightRadarAPI import FlightRadar24API
fr_api = FlightRadar24API()
details = fr_api.get_airport_details('HND')
flights = details['airport']['pluginData']['schedule']['departures']['data']
if flights:
    dest = flights[0]['flight']['airport']['destination']
    print(json.dumps(dest, indent=2))
