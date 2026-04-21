import fastf1
from fastf1.ergast import Ergast
from fastf1.exceptions import RateLimitExceededError

import requests
import asyncio
import schedule
import json
import os
import logging
from time import sleep
from tqdm import tqdm
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CACHE_DIR = os.path.join(BASE_DIR, 'cache', 'standings')
FASTF1_CACHE_DIR = os.path.join(BASE_DIR, 'cache', 'fastf1')

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(FASTF1_CACHE_DIR, exist_ok=True)

fastf1.Cache.enable_cache(FASTF1_CACHE_DIR)

def update_year_standings(year: int, all_driver_standings: dict, all_constructor_standings: dict) -> tuple[list[dict], list[dict]]:
    """Fetches and caches the driver and constructor standings for a given year using FastF1 Library"""

    logger.info(f"Starting to update standings for year {year} using fastf1")
    ergast = Ergast()
    
    driver_evolution = []
    constructor_evolution = []

    try:
        schedule = fastf1.get_event_schedule(year)
        total_rounds = total_rounds = schedule['RoundNumber'].max()
    except Exception as e:
        logger.error(f"Error fetching schedule for year {year}: {e}")
        return driver_evolution, constructor_evolution

    for round_num in tqdm(range(1, total_rounds + 1), leave=False, desc=f"Updating standings for {year}"):

        is_cached_driver = False
        is_cached_constructor = False

        # Check if standings for this round are already cached
        if str(year) in all_driver_standings:
            for round_data in all_driver_standings[str(year)]:
                if round_data.get('round') == str(round_num):
                    driver_evolution.append(round_data)
                    is_cached_driver = True
                    break
        if str(year) in all_constructor_standings:
            for round_data in all_constructor_standings[str(year)]:
                if round_data.get('round') == str(round_num):
                    constructor_evolution.append(round_data)
                    is_cached_constructor = True
                    break
        if is_cached_driver and is_cached_constructor:
            continue

        round_data_driver = {"round": str(round_num)}
        round_data_constructor = {"round": str(round_num)}

        # Fetch standings
        try: 
            driver_res = ergast.get_driver_standings(year, round_num)
            if driver_res.content and not driver_res.content[0].empty:
                driver_df = driver_res.content[0]

                for _, row in driver_df.iterrows():
                    code = row.get('driverCode')
                    if not code or str(code) == 'nan':
                        code = str(row.get('familyName', 'UNK'))[:3].upper()
                    round_data_driver[str(code)] = float(row['points'])

                    # Constructor standings
                    constructor_code = str(row['constructorIds'][-1])
                    if constructor_code not in round_data_constructor.keys():
                        round_data_constructor[constructor_code] = float(row['points'])
                    else:
                        round_data_constructor[constructor_code] += float(row['points'])
                    
                driver_evolution.append(round_data_driver)
                constructor_evolution.append(round_data_constructor)
        except Exception as e:
            logger.warning(f"Year {year} Round {round_num} standings not available yet: {e}")
            raise
        
    return driver_evolution, constructor_evolution

def update_all_standings() -> None:
    """Updates the standings for all years from 1950 to the current year"""

    driver_cache_file = os.path.join(CACHE_DIR, 'driver_standings.json')
    constructor_cache_file = os.path.join(CACHE_DIR, 'constructor_standings.json')

    if os.path.exists(driver_cache_file):
        with open(driver_cache_file, 'r') as f:
            all_driver_standings = json.load(f)
    else:
        all_driver_standings = {}

    if os.path.exists(constructor_cache_file):
        with open(constructor_cache_file, 'r') as f:
            all_constructor_standings = json.load(f)
    else:
        all_constructor_standings = {}

    current_year = datetime.now().year
    for year in tqdm(range(1950, current_year + 1), desc="Updating standings for all years"):

        # 10 Retries with delay in case of API issues or rate limits
        for _ in range(10):
            try:
                driver_evolution, constructor_evolution = update_year_standings(year, all_driver_standings, all_constructor_standings)
                break
            except RateLimitExceededError as e:
                logger.warning(f"Rate limit hit while updating standings for year {year}: {e}. Retrying after delay.")
                sleep(3610)  # Wait before retrying
            except Exception as e:
                logger.error(f"Error updating standings for year {year}: {e}")
                sleep(60)  # Wait before retrying

        if driver_evolution and constructor_evolution:
            all_driver_standings[str(year)] = driver_evolution
            all_constructor_standings[str(year)] = constructor_evolution

        with open(os.path.join(CACHE_DIR, 'driver_standings.json'), 'w') as f:
            json.dump(all_driver_standings, f, indent=4)
        with open(os.path.join(CACHE_DIR, 'constructor_standings.json'), 'w') as f:
            json.dump(all_constructor_standings, f, indent=4)

async def daily_updater():
    """Schedules the update of standings to run daily at midnight"""
    schedule.every().day.at("00:00").do(update_all_standings)
    
    while True:
        schedule.run_pending()
        await asyncio.sleep(60)  # Check every minute for pending tasks