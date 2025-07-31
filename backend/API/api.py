import wss
from data import *
import liveTiming

import os
import json
import time
import threading
import logging

# import fastf1

from flask import Flask, Response
from flask_cors import CORS

from gevent.pywsgi import WSGIServer

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'https://immastersam.github.io'])

@app.route('/stream')
def stream():

    def iter_data():

        round = 9

        while True:
            yield 'data:' + json.dumps(get_race(2025, round + 1, 'R')) + '\n\n'
            time.sleep(5)
            round = (round + 1) % 10 

    return Response(iter_data(), content_type='text/event-stream')

@app.route('/stream/time')
def stream_time():

    def iter_data():

        while True:
            yield 'data:' + json.dumps({'time': time.strftime('%Y-%m-%d %H:%M:%S')}) + '\n\n'
            time.sleep(1)

    return Response(iter_data(), content_type='text/event-stream')

def check_wss():
    """Check if the WebSocket connection is alive."""

    if not wss.wss_thread.is_alive():
        logging.warning('WebSocket thread is not alive, starting it now.')
        wss.wss_thread = threading.Thread(target=wss.connect_wss, daemon=True)
        wss.wss_thread.start()

    if wss.ws_global is None:
        wss.connect_wss()

@app.route('/stream/live')
def stream_live():

    def iter_data():

        check_wss()
        
        yield f'data:{json.dumps({"type": "connected", "timestamp": time.time()})}\n\n'

        while True:

            try:
                live_data = liveTiming.get_live_timing()
                if live_data is None:
                    raise Exception("No live data available")
                else:
                    yield 'data:' + json.dumps(live_data) + '\n\n'

            except Exception as e:
                logging.error(f"Error in live timing stream: {e}")
                yield 'data:' + json.dumps({"error": str(e)}) + '\n\n'

            time.sleep(1)

    return Response(iter_data(), content_type='text/event-stream')

if __name__ == '__main__':

    # 檢查並建立 cache 資料夾
    if not os.path.exists('cache'):
        os.makedirs('cache')

    # fastf1.set_log_level('ERROR')
    # fastf1.Cache.enable_cache('cache')

    wss.wss_thread.start()

    app.run(debug=True)