import os
import json
import asyncio
import logging
from logging.handlers import RotatingFileHandler

from quart import Quart, jsonify
from quart_cors import cors

import standings_updater

app = Quart(__name__)
app = cors(app, allow_origin=['http://localhost:5173', 'https://immastersam.github.io'])

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CACHE_DIR = os.path.join(BASE_DIR, 'cache', 'standings')

# Loggers
file_handler = RotatingFileHandler(
    'api_app.log', 
    maxBytes=10*1024*1024,  
    backupCount=3,          
    encoding='utf-8'
)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] %(message)s'
))
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
root_logger.addHandler(file_handler)
root_logger.addHandler(console_handler)

@app.before_serving
async def startup():
    root_logger.info("Starting up the Standings API server...")
    app.add_background_task(standings_updater.daily_updater)

# API Endpoints

@app.get('/standings/<int:year>/drivers')
async def get_driver_standings(year: int):
    """Endpoint to get the driver standings evolution for a given year"""
    try:
        file_path = os.path.join(CACHE_DIR, 'driver_standings.json')
        if not os.path.exists(file_path):
            return jsonify({"error": "Driver standings data not available"}), 404
        
        with open(file_path, 'r', encoding='utf-8') as f:
            all_data = json.load(f)
        
        if str(year) in all_data:
            return jsonify(all_data[str(year)]), 200
        else:
            return jsonify({"error": f"Driver standings for year {year} not found"}), 404

    except Exception as e:
        root_logger.error(f"Error accessing driver standings cache: {e}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.get('/standings/<int:year>/constructors')
async def get_constructor_standings(year: int):
    """Endpoint to get the constructor standings evolution for a given year"""
    try:
        file_path = os.path.join(CACHE_DIR, 'constructor_standings.json')
        if not os.path.exists(file_path):
            return jsonify({"error": "Constructor standings data not available"}), 404
        
        with open(file_path, 'r', encoding='utf-8') as f:
            all_data = json.load(f)
        
        if str(year) in all_data:
            return jsonify(all_data[str(year)]), 200
        else:
            return jsonify({"error": f"Constructor standings for year {year} not found"}), 404

    except Exception as e:
        root_logger.error(f"Error accessing constructor standings cache: {e}")
        return jsonify({"error": "Internal server error"}), 500
    
if __name__ == '__main__':
    app.run(port=5001, debug=False)