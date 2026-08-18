from flask import Flask, jsonify, request, send_from_directory, Response
import subprocess
import sys
import json
import re
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

AIRPORT_CODE = re.compile(r"^[A-Z]{3}$")


@app.after_request
def add_headers(response):
    response.headers["Cache-Control"] = "no-store"
    return response


# ==========================================
# 案内板本体
# ==========================================
@app.route("/")
def board():
    return send_from_directory(
        BASE_DIR,
        "index.html"
    )


# ==========================================
# 元DesktopFlightBoardのCSSをそのまま使用
# ==========================================
@app.route("/style.css")
def style():
    return send_from_directory(
        BASE_DIR,
        "style.css"
    )


# ==========================================
# Electron用renderer.jsを
# Webブラウザ用に自動変換
# ==========================================
@app.route("/renderer.js")
def renderer():

    renderer_path = os.path.join(
        BASE_DIR,
        "renderer.js"
    )

    with open(
        renderer_path,
        "r",
        encoding="utf-8"
    ) as f:
        original = f.read()


    browser_provider = r"""
class HanedaApiProvider {

    constructor() {
        this.flights = [];
        this.airportCode = 'HND';
    }

    setAirport(code) {
        this.airportCode = code;
    }

    async init() {
        return;
    }

    async fetchDepartures() {

        const response = await fetch(
            '/api/departures?airport=' +
            encodeURIComponent(this.airportCode),
            {
                cache: 'no-store'
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                'Flight data fetch failed'
            );
        }

        const now = new Date();

        this.flights =
            (data.flights || [])
            .map(f => {

                return {
                    ...f,

                    scheduleTime:
                        new Date(
                            f.scheduleTime * 1000
                        ),

                    estimatedTime:
                        f.estimatedTime
                        ? new Date(
                            f.estimatedTime * 1000
                          )
                        : null,

                    codeshareAirline:
                        f.codeshareNumber
                        ? {
                            code:
                                String(
                                    f.codeshareNumber
                                ).substring(0, 2)
                          }
                        : null
                };

            })
            .filter(f => {

                const timeToCheck =
                    f.estimatedTime ||
                    f.scheduleTime;

                return (
                    now.getTime() -
                    timeToCheck.getTime()
                ) < 60 * 60 * 1000;

            })
            .sort(
                (a, b) =>
                    a.scheduleTime -
                    b.scheduleTime
            );

        return this.flights;
    }
}
"""


    target = (
        "const HanedaApiProvider = "
        "require('./providers/HanedaApiProvider');"
    )

    if target not in original:

        return Response(
            "console.error("
            "'renderer.jsの変換に失敗しました'"
            ");",
            mimetype="application/javascript"
        )


    converted = original.replace(
        target,
        browser_provider
    )


    return Response(
        converted,
        mimetype="application/javascript"
    )


# ==========================================
# 動作確認
# ==========================================
@app.route("/health")
def health():

    return jsonify({
        "status": "ok"
    })


# ==========================================
# FlightRadar24 出発便API
# ==========================================
@app.route("/api/departures")
def departures():

    airport = (
        request.args
        .get("airport", "HND")
        .upper()
        .strip()
    )

    if not AIRPORT_CODE.match(airport):

        return jsonify({
            "error":
                "Invalid airport code"
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
                "error":
                    "Flight data fetch failed",

                "details":
                    result.stderr[-1500:]
            }), 500


        output = result.stdout.strip()


        if not output:

            return jsonify({
                "airport": airport,
                "count": 0,
                "flights": []
            })


        try:

            flights = json.loads(
                output
            )


        except json.JSONDecodeError:

            lines = [
                line.strip()
                for line
                in output.splitlines()
                if line.strip()
            ]

            flights = None


            for line in reversed(lines):

                try:

                    flights = json.loads(
                        line
                    )

                    break

                except json.JSONDecodeError:

                    continue


            if flights is None:

                return jsonify({
                    "error":
                        "Could not read flight data",

                    "raw":
                        output[-1500:]
                }), 500


        return jsonify({
            "airport":
                airport,

            "count":
                len(flights),

            "flights":
                flights
        })


    except subprocess.TimeoutExpired:

        return jsonify({
            "error":
                "Flight data request timed out"
        }), 504


    except Exception as e:

        return jsonify({
            "error":
                str(e)
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
