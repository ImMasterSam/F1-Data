import wss
from data import *
import liveTiming

import os
import json
import time
import threading
import logging
from logging.handlers import RotatingFileHandler

# import fastf1

from flask import Flask, Response
from flask_cors import CORS

# from gevent.pywsgi import WSGIServer

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'https://immastersam.github.io'])



# logger settings
file_handler = RotatingFileHandler(
    'app.log', 
    maxBytes=10*1024*1024,  # 10 MB
    backupCount=3           # 3 backup files
)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] %(message)s'
))

console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(levelname)s - %(message)s'
))

root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
root_logger.addHandler(file_handler)
root_logger.addHandler(console_handler)

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
        root_logger.warning('WebSocket thread is not alive, starting it now.')
        wss.wss_thread = threading.Thread(target=wss.connect_wss, daemon=True)
        wss.wss_thread.start()

    if wss.ws_global is None:
        wss.connect_wss()

@app.route('/stream/live')
def stream_live():

    def iter_data():

        check_wss()
        
        yield f'data:{json.dumps({"type": "connected", "timestamp": time.time()})}\n\n'

        try:
            while True:

                try:
                    live_data = liveTiming.get_live_timing()
                    if live_data is None:
                        raise Exception("No live data available")
                    else:
                        yield 'data:' + json.dumps(live_data) + '\n\n'
                except GeneratorExit:
                    root_logger.info("Client disconnected from SSE stream")
                    return

                except Exception as e:
                    logging.exception("Error in live timing stream")
                    yield 'data:' + json.dumps({"error": str(e)}) + '\n\n'

                time.sleep(1)
        except Exception as e:
            logging.exception("Unexpected error in SSE stream")
            return

    return Response(iter_data(), content_type='text/event-stream')

if __name__ == '__main__':

    # 檢查並建立 cache 資料夾
    # if not os.path.exists('cache'):
    #     os.makedirs('cache')

    wss.wss_thread.start()
    wss.monitor_thread.start()

    app.run(debug=True)