import json
import urllib.parse
import websocket
import requests
import threading
import time
import datetime
import logging

current_session_path = ""
should_restart = False

ws_global: websocket.WebSocketApp = None
data_global: dict = None
driver_global: dict = None
last_driver_received: datetime.datetime = None

SUBS_TITLE = ["TimingData", "TimingStats", "TimingAppData", "CarData.z", "Position.z", "WeatherData", "TrackStatus", "ExtrapolatedClock", "RaceControlMessages", "TeamRadio", "LapCount", "SessionInfo"]


def restart_wss():

    global ws_global, should_restart
    print("Restarting WebSocket connection due to session change...")

    if ws_global:
        ws_global.close()
    
    time.sleep(1)
    should_restart = True

def get_current_session_path():

    try:
        url = "https://livetiming.formula1.com/static/SessionInfo.json"
        res = requests.get(url)
        if res.status_code == 200:
            data = json.loads(res.content.decode('utf-8-sig'))
            return data.get('Path', '')
    except Exception as e:
        logging.error(f"Error fetching current session path: {e}")

def monitor_session():

    while True:
        time.sleep(60)
        try:
            active_path = get_current_session_path()

            if not active_path or not current_session_path:
                continue

            if active_path != current_session_path:
                print(f"Session path changed from {current_session_path} to {active_path}")
                restart_wss()

                if not wss_thread.is_alive():
                    wss_thread = threading.Thread(target=connect_wss, daemon=True)
                    wss_thread.start()

        except Exception as e:
            logging.error(f"Error monitoring session: {e}")

def negotiate(hub):

    url = f'https://livetiming.formula1.com/signalr/negotiate?connectionData={hub}&clientProtocol=1.5'
    res = requests.get(url)
    
    if res.status_code != 200:
        raise Exception(f"Failed to negotiate: {res.status_code} {res.text}")

    res_content: dict = res.json()
    res_headers = res.headers
    token = res_content.get('ConnectionToken')
    cookie = res_headers.get('Set-Cookie')

    return token, cookie

def connect_wss():

    global ws_global
    
    name_json = [{"name": "Streaming"}]
    hub = urllib.parse.quote(json.dumps(name_json))

    token, cookie = negotiate(hub)
    endcodedToken = urllib.parse.quote(token)
    url = f'wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken={endcodedToken}&connectionData={hub}'

    headers = [
        "User-Agent: BestHTTP",
        "Accept-Encoding: gzip,identity",
        f"Cookie: {cookie}"
    ]

    def on_open(ws: websocket.WebSocketApp):
        print("WebSocket opened")
        subscribe_titles = SUBS_TITLE.copy()
        subscribe_titles.append("DriverList")
        subscribe_titles.append("Heartbeat")
        subscribe_msg = {
            "H": "Streaming",
            "M": "Subscribe",
            "A": [subscribe_titles],
            "I": 1
        }
        ws.send(json.dumps(subscribe_msg))
        

    def on_message(ws: websocket.WebSocketApp, message):
        global data_global, driver_global, last_driver_received

        # print("received Message: ", message[:100], "...")  # Print first 100 characters for brevity
        msg_json = json.loads(message)
        if msg_json.get('R'):

            data_global = msg_json.get('R')
            if data_global.get('DriverList'):
                last_driver_received = datetime.datetime.now()
                driver_global = data_global.get('DriverList')
            else:
                if (data_global is not None) and (driver_global is not None):
                    data_global['DriverList'] = driver_global
                else:
                    raise Exception("DriverList not found in data_global and driver_global is None")
            # print("Data received:", data_global)

            subscribe_titles = SUBS_TITLE.copy()
            if driver_global is None:
                subscribe_titles.append("DriverList")
            elif last_driver_received is None or (datetime.datetime.now() - last_driver_received).total_seconds() > 300:
                print("DriverList is None or not received in the last 5 minutes, resubscribing")
                subscribe_titles.append("DriverList")

            subscribe_msg = {
                "H": "Streaming",
                "M": "Subscribe",
                "A": [subscribe_titles],
                "I": 1
            }
            ws.send(json.dumps(subscribe_msg))
            # print("Sent subscribe message")

    def on_error(ws, error):
        print("error:", error)

    def on_close(ws, close_status_code, close_msg):
        print("WebSocket closed")

    ws = websocket.WebSocketApp(
        url,
        header=headers,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    ws_global = ws
    ws.run_forever(ping_interval=0.5)


wss_thread = threading.Thread(target=connect_wss, daemon=True)
monitor_thread = threading.Thread(target=monitor_session, daemon=True)

if __name__ == "__main__":
    connect_wss()