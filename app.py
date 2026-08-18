from flask import (
    Flask,
    jsonify,
    request,
    send_from_directory,
    render_template_string,
    redirect,
    url_for,
    session
)

from datetime import timedelta
import subprocess
import sys
import json
import re
import os
import hmac


app = Flask(__name__)

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ==========================================
# RenderのEnvironment Variables
# ==========================================

FLIGHTBOARD_PASSWORD = os.environ.get(
    "FLIGHTBOARD_PASSWORD"
)

SECRET_KEY = os.environ.get(
    "SECRET_KEY"
)


if not FLIGHTBOARD_PASSWORD:
    raise RuntimeError(
        "FLIGHTBOARD_PASSWORD is not configured"
    )


if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not configured"
    )


app.config["SECRET_KEY"] = SECRET_KEY

app.config["SESSION_COOKIE_SECURE"] = True

app.config["SESSION_COOKIE_HTTPONLY"] = True

app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(
    days=30
)


AIRPORT_CODE = re.compile(
    r"^[A-Z]{3}$"
)


ALLOWED_DIRECTIONS = {
    "departures",
    "arrivals"
}


# ==========================================
# 未ログインアクセスをブロック
# ==========================================

@app.before_request
def require_login():

    # ログイン画面だけは誰でも開ける
    if request.endpoint == "login":
        return None

    # ログイン済み
    if session.get("authenticated") is True:
        return None

    # APIへ直接アクセスされた場合
    if request.path.startswith("/api/"):

        return jsonify({
            "error": "Authentication required"
        }), 401

    # その他はログイン画面へ
    return redirect(
        url_for("login")
    )


# ==========================================
# ログイン
# ==========================================

@app.route(
    "/login",
    methods=["GET", "POST"]
)
def login():

    error = ""

    if request.method == "POST":

        entered_password = request.form.get(
            "password",
            ""
        )

        if hmac.compare_digest(
            entered_password,
            FLIGHTBOARD_PASSWORD
        ):

            session.clear()

            session["authenticated"] = True

            session.permanent = True

            return redirect(
                url_for("board")
            )

        error = "パスワードが違います"


    return render_template_string(
        """
<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
>

<meta
    name="apple-mobile-web-app-capable"
    content="yes"
>

<meta
    name="apple-mobile-web-app-status-bar-style"
    content="black"
>

<title>Flight Board Login</title>


<style>

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #07131f;
    color: white;

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Helvetica Neue",
        Arial,
        sans-serif;
}


body {
    display: flex;
    align-items: center;
    justify-content: center;
}


.login-box {
    width: min(
        420px,
        calc(100vw - 40px)
    );

    background: #102235;

    border:
        1px solid
        rgba(255,255,255,0.12);

    border-radius: 14px;

    padding: 34px;

    box-shadow:
        0 20px 60px
        rgba(0,0,0,0.35);
}


.icon {
    font-size: 34px;
    margin-bottom: 16px;
}


.title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
}


.subtitle {
    color: #9eafbf;
    font-size: 14px;
    margin-bottom: 28px;
}


label {
    display: block;
    margin-bottom: 8px;

    color: #c7d2dc;

    font-size: 13px;
}


input {
    width: 100%;

    padding: 14px 15px;

    border-radius: 8px;

    border:
        1px solid
        rgba(255,255,255,0.18);

    background: #07131f;

    color: white;

    font-size: 17px;

    outline: none;
}


input:focus {
    border-color: #e9c341;
}


button {
    width: 100%;

    margin-top: 18px;

    padding: 14px;

    border: none;

    border-radius: 8px;

    background: #e9c341;

    color: #07131f;

    font-size: 16px;

    font-weight: 700;

    cursor: pointer;
}


.error {
    margin-top: 16px;

    color: #ff7777;

    text-align: center;

    font-size: 14px;
}


.private {
    margin-top: 24px;

    color: #718497;

    text-align: center;

    font-size: 11px;

    letter-spacing: 0.08em;
}

</style>

</head>


<body>


<div class="login-box">

    <div class="icon">
        ✈
    </div>

    <div class="title">
        Flight Board
    </div>

    <div class="subtitle">
        Private Flight Information Board
    </div>


    <form method="POST">

        <label>
            PASSWORD
        </label>

        <input
            type="password"
            name="password"
            autocomplete="current-password"
            autofocus
            required
        >

        <button type="submit">
            LOGIN
        </button>

    </form>


    {% if error %}

    <div class="error">
        {{ error }}
    </div>

    {% endif %}


    <div class="private">
        PRIVATE ACCESS
    </div>

</div>


</body>

</html>
        """,
        error=error
    )


# ==========================================
# ログアウト
# ==========================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("login")
    )


# ==========================================
# Flight Board本体
# ==========================================

@app.route("/")
def board():

    return send_from_directory(
        BASE_DIR,
        "index.html"
    )


@app.route("/style.css")
def style():

    return send_from_directory(
        BASE_DIR,
        "style.css"
    )


@app.route("/renderer.js")
def renderer():

    return send_from_directory(
        BASE_DIR,
        "renderer.js"
    )


# ==========================================
# Pythonから便情報取得
# ==========================================

def load_flights(
    airport,
    direction
):

    result = subprocess.run(
        [
            sys.executable,

            os.path.join(
                BASE_DIR,
                "python_scripts",
                "fetch_flights.py"
            ),

            airport,

            direction
        ],

        capture_output=True,

        text=True,

        timeout=90,

        cwd=BASE_DIR
    )


    if result.returncode != 0:

        raise RuntimeError(
            result.stderr[-2000:]
            or
            "Flight data fetch failed"
        )


    output = result.stdout.strip()


    if not output:

        return []


    try:

        value = json.loads(
            output
        )

        if isinstance(
            value,
            list
        ):

            return value


    except json.JSONDecodeError:

        pass


    lines = [

        line.strip()

        for line
        in output.splitlines()

        if line.strip()

    ]


    for line in reversed(
        lines
    ):

        try:

            value = json.loads(
                line
            )

            if isinstance(
                value,
                list
            ):

                return value


        except json.JSONDecodeError:

            continue


    raise RuntimeError(
        "Could not read flight data"
    )


# ==========================================
# 共通API
# ==========================================

def flight_api(
    direction
):

    airport = (
        request.args
        .get(
            "airport",
            "HND"
        )
        .upper()
        .strip()
    )


    if not AIRPORT_CODE.fullmatch(
        airport
    ):

        return jsonify({
            "error":
                "Invalid airport code"
        }), 400


    if direction not in ALLOWED_DIRECTIONS:

        return jsonify({
            "error":
                "Invalid direction"
        }), 400


    try:

        flights = load_flights(
            airport,
            direction
        )


        return jsonify({

            "airport":
                airport,

            "direction":
                direction,

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
                "Flight data fetch failed",

            "details":
                str(e)

        }), 500


# ==========================================
# 出発
# ==========================================

@app.route(
    "/api/departures"
)
def departures():

    return flight_api(
        "departures"
    )


# ==========================================
# 到着
# ==========================================

@app.route(
    "/api/arrivals"
)
def arrivals():

    return flight_api(
        "arrivals"
    )


# ==========================================
# 共通
# ==========================================

@app.route(
    "/api/flights"
)
def flights():

    direction = (
        request.args
        .get(
            "direction",
            "departures"
        )
        .lower()
        .strip()
    )


    return flight_api(
        direction
    )


# ==========================================
# 動作確認
# ==========================================

@app.route(
    "/health"
)
def health():

    return jsonify({
        "status":
            "ok",

        "authenticated":
            True
    })


# ==========================================
# 起動
# ==========================================

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
