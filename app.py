from flask import Flask, jsonify, request
import subprocess
import sys
import json
import re
import os

app = Flask(__name__)

AIRPORT_CODE = re.compile(r"^[A-Z]{3}$")


@app.after_request
def add_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.route("/")
def home():
    return jsonify({
        "status": "ok",
        "message": "Desktop Flight Board Web API is running"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "ok"
    })


@app.route("/api/departures")
def departures():

    airport = request.args.get("airport", "HND").upper().strip()

    if not AIRPORT_CODE.match(airport):
        return jsonify({
            "error": "Invalid airport code"
        }), 400

    try:

        result = subprocess.run(
            [
                sys.executable,
                "python_scripts/fetch_flights.py",
                airport
            ],
            capture_output=True,
            text=True,
            timeout=45
        )

        if result.returncode != 0:
            return jsonify({
                "error": "Flight data fetch failed",
                "details": result.stderr[-1500:]
            }), 500

        output = result.stdout.strip()

        if not output:
            return jsonify({
                "airport": airport,
                "count": 0,
                "flights": []
            })

        try:
            flights = json.loads(output)

        except json.JSONDecodeError:

            lines = [
                line.strip()
                for line in output.splitlines()
                if line.strip()
            ]

            flights = None

            for line in reversed(lines):
                try:
                    flights = json.loads(line)
                    break
                except json.JSONDecodeError:
                    continue

            if flights is None:
                return jsonify({
                    "error": "Could not read flight data",
                    "raw": output[-1500:]
                }), 500

        return jsonify({
            "airport": airport,
            "count": len(flights),
            "flights": flights
        })

    except subprocess.TimeoutExpired:

        return jsonify({
            "error": "Flight data request timed out"
        }), 504

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            10000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )
