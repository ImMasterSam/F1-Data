import json
import urllib.parse
import websocket
import requests

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
    
    name_json = [{"name": "Streaming"}]
    hub = urllib.parse.quote(json.dumps(name_json))

    token, cookie = negotiate(hub)
    endcodedToken = urllib.parse.quote(token)
    url = f'wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken={endcodedToken}&connectionData={hub}'

    print("token:", token)
    print("cookie:", cookie)

    headers = [
        "User-Agent: BestHTTP",
        "Accept-Encoding: gzip,identity",
        f"Cookie: {cookie}"
    ]

    def on_open(ws: websocket.WebSocketApp):
        print("WebSocket opened")
        subscribe_msg = {
            "H": "Streaming",
            "M": "Subscribe",
            "A": [["Heartbeat"]],
            "I": 1
        }
        ws.send(json.dumps(subscribe_msg))
        

    def on_message(ws, message):
        print("received", message)

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
    ws.run_forever(ping_interval= 0.5)

if __name__ == "__main__":
    connect_wss()