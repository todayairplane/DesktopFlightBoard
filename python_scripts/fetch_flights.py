#!/usr/bin/env python3

import json
import sys
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning)

try:
    from FlightRadarAPI import FlightRadar24API
except ImportError:
    from FlightRadar24 import FlightRadar24API


def fetch_departures(airport_code="HND"):

    fr_api = FlightRadar24API()

    all_departures = []

    # 100便 × 2ページ = 最大200便取得
    for page in [1, 2]:

        airport_details = fr_api.get_airport_details(
            airport_code,
            flight_limit=100,
            page=page
        )

        if (
            'airport' not in airport_details
            or 'pluginData' not in airport_details['airport']
        ):
            continue

        schedule = (
            airport_details['airport']
            ['pluginData']
            .get('schedule', {})
        )

        departures = (
            schedule
            .get('departures', {})
            .get('data', [])
        )

        all_departures.extend(departures)


    flights_list = []

    # 重複防止
    seen = set()


    for item in all_departures:

        flight = item.get('flight') or {}

        time_info = flight.get('time') or {}

        scheduled_info = (
            time_info.get('scheduled') or {}
        )

        schedule_time = (
            scheduled_info.get('departure')
        )

        if not schedule_time:
            continue


        identification = (
            flight.get('identification') or {}
        )

        number_info = (
            identification.get('number') or {}
        )

        flight_num = (
            number_info.get('default')
        )

        flight_id = (
            identification.get('id')
            or flight_num
            or ''
        )


        unique_key = (
            str(flight_id),
            str(schedule_time)
        )

        if unique_key in seen:
            continue

        seen.add(unique_key)


        estimated_info = (
            time_info.get('estimated') or {}
        )

        estimated_time = (
            estimated_info.get('departure')
        )

        if estimated_time == schedule_time:
            estimated_time = None


        destination = (
            flight
            .get('airport', {})
            .get('destination')
        )


        if destination:

            dest_name = (
                destination.get('name', '')
            )

            city = (
                destination
                .get('position', {})
                .get('region', {})
                .get('city')
            )

            if not city:
                city = dest_name

            dest_sub = (
                destination
                .get('code', {})
                .get('iata', '')
            )

            dest_country = (
                destination
                .get('position', {})
                .get('country', {})
                .get('code', '')
            )

        else:

            city = "Unknown"
            dest_sub = ""
            dest_country = ""


        airline = flight.get('airline')


        if airline:

            airline_name = (
                airline.get('name', '')
            )

            airline_code = (
                airline
                .get('code', {})
                .get('iata', '')
            )

        else:

            airline_name = "Unknown"
            airline_code = ""


        codeshares = (
            identification.get('codeshare')
        )

        codeshare_num = (
            codeshares[0]
            if codeshares
            and len(codeshares) > 0
            else None
        )


        origin = (
            flight
            .get('airport', {})
            .get('origin')
        )


        if origin and 'info' in origin:

            terminal = (
                origin['info']
                .get('terminal', '')
            )

            gate = (
                origin['info']
                .get('gate', '')
            )

        else:

            terminal = ''
            gate = ''


        status_text = "ON TIME"


        if (
            estimated_time
            and estimated_time
            > schedule_time + 300
        ):
            status_text = "DELAYED"


        status_info = (
            flight.get('status') or {}
        )

        fr_status = (
            status_info.get('text') or ''
        )


        if "Boarding" in fr_status:

            status_text = "BOARDING"

        elif "Departed" in fr_status:

            status_text = "DEPARTED"

        elif (
            "Canceled" in fr_status
            or "Cancelled" in fr_status
        ):

            status_text = "CANCELED"


        flights_list.append({

            "id":
                flight_id,

            "scheduleTime":
                schedule_time,

            "estimatedTime":
                estimated_time,

            "destination":
                city,

            "destinationSub":
                dest_sub,

            "destinationCountry":
                dest_country,

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

            "terminal":
                f"T{terminal}"
                if terminal
                else "",

            "gate":
                gate or "",

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

    fetch_departures(airport)
