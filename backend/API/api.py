import wss
from data import *
from liveTiming import get_live_timing

import os
import json
import time
import threading

import fastf1

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

@app.route('/stream/live')
def stream_live():

    def iter_data():

        while True:
            yield 'data:' + json.dumps(get_live_timing()) + '\n\n'
            time.sleep(1)

    return Response(iter_data(), content_type='text/event-stream')

if __name__ == '__main__':

    # 檢查並建立 cache 資料夾
    if not os.path.exists('cache'):
        os.makedirs('cache')

    fastf1.set_log_level('ERROR')
    fastf1.Cache.enable_cache('cache')

    t = threading.Thread(target=wss.connect_wss, daemon=True)
    t.start()

    app.run(debug=True, host='0.0.0.0')