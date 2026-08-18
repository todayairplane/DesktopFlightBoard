#!/usr/bin/env python3

import json
import sys
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning)

try:
    from FlightRadarAPI import FlightRadar24API
except ImportError:
    from FlightRadar24 import FlightRadar24API


def fetch_flights(airport_code="HND", direction="departures"):

    airport_code = airport_code.upper().strip()
    direction = direction.lower().strip()

    if direction not in ["departures", "arrivals"]:
        direction = "departures"

    fr_api = FlightRadar24API()

    all_items = []

    # 100便 × 2ページ ＝ 最大200便
    for page in [1, 2]:

        airport_details = fr_api.get_airport_details(
            airport_code,
            flight_limit=100,
            page=page
        )

        airport_data = airport_details.get("airport") or {}

        plugin_data = airport_data.get("pluginData") or {}

        schedule = plugin_data.get("schedule") or {}

        direction_data = schedule.get(direction) or {}

        items = direction_data.get("data") or []

        all_items.extend(items)


    flights_list = []

    seen = set()


    for item in all_items:

        flight = item.get("flight") or {}

        time_info = flight.get("time") or {}

        scheduled_info = time_info.get("scheduled") or {}

        estimated_info = time_info.get("estimated") or {}


        if direction == "arrivals":

            schedule_time = scheduled_info.get("arrival")

            estimated_time = estimated_info.get("arrival")

        else:

            schedule_time = scheduled_info.get("departure")

            estimated_time = estimated_info.get("departure")


        if not schedule_time:
            continue


        identification = flight.get("identification") or {}

        number_info = identification.get("number") or {}

        flight_num = number_info.get("default") or ""

        flight_id = (
            identification.get("id")
            or flight_num
            or ""
        )


        unique_key = (
            str(flight_id),
            str(schedule_time),
            direction
        )


        if unique_key in seen:
            continue

        seen.add(unique_key)


        if estimated_time == schedule_time:
            estimated_time = None


        airports = flight.get("airport") or {}


        if direction == "arrivals":

            location = airports.get("origin") or {}

            airport_info = airports.get("destination") or {}

        else:

            location = airports.get("destination") or {}

            airport_info = airports.get("origin") or {}


        location_name = location.get("name") or ""

        location_position = location.get("position") or {}

        location_region = location_position.get("region") or {}

        location_country = location_position.get("country") or {}

        location_code = location.get("code") or {}


        city = (
            location_region.get("city")
            or location_name
            or "Unknown"
        )


        iata = location_code.get("iata") or ""

        country_code = location_country.get("code") or ""


        airline = flight.get("airline") or {}

        airline_name = airline.get("name") or ""

        airline_codes = airline.get("code") or {}

        airline_code = airline_codes.get("iata") or ""


        codeshares = identification.get("codeshare") or []

        codeshare_num = (
            codeshares[0]
            if len(codeshares) > 0
            else None
        )


        info = airport_info.get("info") or {}

        terminal = info.get("terminal") or ""

        gate = info.get("gate") or ""


        aircraft = flight.get("aircraft") or {}

        aircraft_model = aircraft.get("model") or {}

        aircraft_code = (
            aircraft_model.get("code")
            or aircraft.get("code")
            or ""
        )


        aircraft_text = (
            aircraft_model.get("text")
            or ""
        )


        status_text = "ON TIME"


        if (
            estimated_time
            and schedule_time
            and estimated_time > schedule_time + 300
        ):
            status_text = "DELAYED"


        status_info = flight.get("status") or {}

        fr_status = str(
            status_info.get("text") or ""
        ).lower()


        if "boarding" in fr_status:

            status_text = "BOARDING"

        elif (
            "cancel" in fr_status
        ):

            status_text = "CANCELED"

        elif direction == "departures" and (
            "departed" in fr_status
            or "takeoff" in fr_status
        ):

            status_text = "DEPARTED"

        elif direction == "arrivals" and (
            "landed" in fr_status
            or "arrived" in fr_status
        ):

            status_text = "ARRIVED"


        flights_list.append({

            "id":
                flight_id,

            "direction":
                direction,

            "scheduleTime":
                schedule_time,

            "estimatedTime":
                estimated_time,

            "location":
                city,

            "locationSub":
                iata,

            "locationCountry":
                country_code,

            "airline": {

                "name":
                    airline_name,

                "code":
                    airline_code
            },

            "flightNumber":
                flight_num,

            "codeshareNumber":
                codeshare_num,

            "aircraftCode":
                aircraft_code,

            "aircraftText":
                aircraft_text,

            "terminal":
                f"T{terminal}"
                if terminal
                else "",

            "gate":
                str(gate)
                if gate
                else "",

            "status":
                status_text
        })


    flights_list.sort(
        key=lambda x:
        x.get("scheduleTime") or 0
    )


    print(
        json.dumps(
            flights_list,
            ensure_ascii=False
        )
    )


if __name__ == "__main__":

    airport = (
        sys.argv[1]
        if len(sys.argv) > 1
        else "HND"
    )

    direction = (
        sys.argv[2]
        if len(sys.argv) > 2
        else "departures"
    )

    fetch_flights(
        airport,
        direction
    )
