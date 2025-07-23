import fastf1
from fastf1.livetiming.data import LiveTimingData
from fastf1.core import Session, Lap

import base64
import zlib
import json
import pandas as pd
import datetime
import threading
import time

import wss

current_session = {
    'updateTime': datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(hours=5),
    'session': None
}

def update_current_session() -> bool:
    """Get the current live session""" 

    global current_session

    # Check if the current session is still valid
    current_time = datetime.datetime.now(tz=datetime.timezone.utc)
    if current_time - current_session['updateTime'] < datetime.timedelta(minutes=5):
        return False

    try:
        schedule = fastf1.get_event_schedule(current_time.year)
    except:
        try:
            schedule = fastf1.get_event_schedule(2025)
        except:
            raise ValueError(f"Failed to load any schedule data. ({current_time})")
    target_time = current_time + datetime.timedelta(minutes=15)  # Look for sessions starting within the last 5 minutes

    for round, event in schedule[::-1].iterrows():
        # print(event)

        for session in range(5, 0, -1):
            session_timestamp: pd.Timestamp = event[f'Session{session}Date']
            session_time = session_timestamp.to_pydatetime()
            session_time = session_time.astimezone(tz=datetime.timezone.utc) 
            if session_time <= target_time:
                current_session = {
                    'updateTime': current_time,
                    'session': fastf1.get_session(current_time.year, event['RoundNumber'], session)
                } 
                current_session['session'].load(laps=False, weather=False, telemetry=False)
                return True
            
def decompressed_carData(raw_car_data: dict) -> dict:
    """Decompress the car data from the raw data"""

    if not raw_car_data:
        return {}

    compressed_bytes = base64.b64decode(raw_car_data)
    decompressed_data = zlib.decompress(compressed_bytes, -zlib.MAX_WBITS)
    car_data = json.loads(decompressed_data.decode('utf-8'))

    return car_data.get('Entries', [0])[-1].get('Cars', {})
            
def get_driver_info(driver_number: str, drivers_raw_data: dict) -> dict:
    """Get the driver info for a given driver number"""

    driver_raw_data = drivers_raw_data.get(driver_number, {})

    driver_data = { 'driverNumber': int(driver_raw_data.get('RacingNumber', driver_number)),
                    'driverFullName': driver_raw_data.get('FullName', 'Unknown'),
                    'driverAbbreviation': driver_raw_data.get('Tla', '???'), 
                    'driverTeamColor': driver_raw_data.get('TeamColour', 'FFFFFF'),}

    return driver_data

def get_drspit_info(driver_timing_info: dict, car_info: dict) -> dict:
    """Get the DRS info for a driver"""

    # DRS
    DRS_ENABLED = {10, 12, 14}

    drs_raw = car_info.get('Channels', {}).get('45', 0)
    if drs_raw in DRS_ENABLED:
        drs_status = 2  # DRS is enabled
    elif drs_raw == 8:
        drs_status = 1  # DRS is ready
    else:
        drs_status = 0

    # PIT
    inPit = driver_timing_info.get('InPit', False)
    PitOut = driver_timing_info.get('PitOut', False)

    if inPit:
        pit_status = 1  # In pit
    elif PitOut:
        pit_status = 2  # Out of pit
    else:
        pit_status = 0

    drspit_info = { 'drsStatus': drs_status,
                 'pitStatus': pit_status}

    return drspit_info

def get_driver_status(driver_timing_info: dict, entries: int = 999) -> str:
    """Get the current status of a driver"""

    status = {'retired': driver_timing_info.get('Retired', True),
              'stopped': driver_timing_info.get('Stopped', True),
              'knockedOut': driver_timing_info.get('KnockedOut', False),
              'danger': int(driver_timing_info.get('Position', 99)) > entries,}
    
    return status

def get_current_tire_info(driver_number: str, tire_raw_data: dict) -> dict:
    """Get the current tire info for a driver"""

    driver_tire_info = tire_raw_data.get('Lines', {}).get(driver_number, {})

    try:
        last_stint = driver_tire_info.get('Stints', {})[-1]
    except:
        last_stint = {}

    tire_info = { 'compound': last_stint.get('Compound', 'UNKNOWN'),
                  'laps': int(last_stint.get('TotalLaps', '0'))}
    
    return tire_info

def get_gap_info(driver_timing_info: dict, session: str, session_part: str = '') -> dict:
    """Get the current gap info for a driver to the leader and the driver in front"""

    if session == 'Qualifying':
        # In qualifying, the gap info is in the stats
        driver_stats = driver_timing_info.get('Stats', {})[int(session_part) - 1]

        gap_info = { 'toLeader': driver_stats.get('TimeDiffToFastest', '-- ---'),
                     'toFront': driver_stats.get('TimeDifftoPositionAhead', '-- ---')}

    # Else they are in the timing data    
    elif session == 'Race':
        gap_info = { 'toLeader': driver_timing_info.get('GapToLeader', '-- ---'),
                     'toFront': driver_timing_info.get('IntervalToPositionAhead', {'Value': '-- ---'}).get('Value', '-- ---')}
    elif session.startswith('Practice'):
        gap_info = { 'toLeader': driver_timing_info.get('TimeDiffToFastest', '-- ---'),
                     'toFront': driver_timing_info.get('TimeDiffToPositionAhead', '-- ---')}
    
    return gap_info

def get_lap_info(driver_stats_info: dict, driver_timing_info: dict) -> dict:
    """Get the lap time info for a driver"""

    lastLap_info = driver_timing_info.get('LastLapTime', {'Value': ''})
    lastLap = { 'lapTime': lastLap_info.get('Value', '-- ---'),
                'overallFastest': lastLap_info.get('OverallFastest', False),
                'personalFastest': lastLap_info.get('PersonalFastest', False)}
    
    bestLap_info = driver_stats_info.get('PersonalBestLapTime', {'Value': ''})
    bestLap = { 'lapTime': bestLap_info.get('Value', '-- ---'),
                'overallFastest': bestLap_info.get('Position', 0) == 1,
                'personalFastest': bestLap_info.get('PersonalFastest', False)}

    lap_info = { 'lastLap': lastLap,
                 'bestLap': bestLap}

    return lap_info

def get_sector_info(driver_stats_info: dict, driver_timing_info: dict) -> list:
    """Get the sector info for a driver"""

    sectors = []

    for i in range(3):
        sector_last_info = driver_timing_info.get(f'Sectors')[i]
        sector_best_info = driver_stats_info.get(f'BestSectors')[i]

        sector_last_sectorTime = sector_last_info.get('Value', '-- ---')
        sector_best_sectorTime = sector_best_info.get('Value', '-- ---')

        sector_last = { 'sectorTime': sector_last_sectorTime if sector_last_sectorTime != '' else '-- ---',
                        'previousSectorTime': sector_last_info.get('PreviousValue', '-- ---'),
                        'overallFastest': sector_last_info.get('OverallFastest', False),
                        'personalFastest': sector_last_info.get('PersonalFastest', False)}
        
        sector_best = { 'sectorTime': sector_best_sectorTime if sector_best_sectorTime != '' else '-- ---',
                        'previousSectorTime': sector_best_info.get('PreviousValue', '-- ---'),
                        'overallFastest': sector_best_info.get('Position', 0) == 1,
                        'personalFastest': sector_best_info.get('PersonalFastest', False)}

        sector_data = { 'sectorLast': sector_last,
                        'sectorBest': sector_best,
                        'segments': [segment.get('Status') for segment in sector_last_info.get('Segments', [])]}

        sectors.append(sector_data)
    
    return sectors

def get_weather_info(weather_raw_data: dict) -> dict:
    """Get the current weather info"""

    weather_info = { 'airTemp': float(weather_raw_data.get('AirTemp', '0')),
                     'humidity': float(weather_raw_data.get('Humidity', '0')),
                     'pressure': float(weather_raw_data.get('Pressure', '0')),
                     'rainfall': weather_raw_data.get('Rainfall', '0') == '1',
                     'trackTemp': float(weather_raw_data.get('TrackTemp', '0')),
                     'windDirection': int(weather_raw_data.get('WindDirection', '0')),
                     'windSpeed': float(weather_raw_data.get('WindSpeed', '0')) * 3.6}

    return weather_info

def get_extrapolated_clock(clock_raw_data: dict) -> dict:

    remaining_time = clock_raw_data.get('Remaining', '00:00:00')
    h, m, s = map(int, remaining_time.split(':'))
    remaining_seconds = h * 3600 + m * 60 + s

    clock = {
        'remaining': remaining_seconds,
        'extrapolating': clock_raw_data.get('Extrapolating', False)
    }

    return clock


def get_live_timing() -> dict:
    """Get the live timing data from the WebSocket connection"""

    global current_session

    # update current session
    if update_current_session():
        wss.wss_thread = threading.Thread(target=wss.connect_wss, daemon=True)
        wss.wss_thread.start()
        print("Current session updated successfully.")


    # Load current session
    # session: Session = current_session.get('session')

    res = dict()
    
    try:
        drivers_raw_data: dict = wss.data_global.get('DriverList')
        timing_raw_data: dict = wss.data_global.get('TimingData')
        stats_raw_data: dict = wss.data_global.get('TimingStats')
        tire_raw_data: dict = wss.data_global.get('TimingAppData')
        weather_raw_data: dict = wss.data_global.get('WeatherData')
        trackStatus_raw_data: dict = wss.data_global.get('TrackStatus')
        clock_raw_data: dict = wss.data_global.get('ExtrapolatedClock')
        session_raw_data: dict = wss.data_global.get('SessionInfo')
        lapCount_raw_data: dict = wss.data_global.get('LapCount')
        car_raw_data: dict = wss.data_global.get('CarData.z')
        raceControlMessages_raw_data: dict = wss.data_global.get('RaceControlMessages')
    except:
        print("No live data available yet")
        return res
    
    meeting_data = session_raw_data.get('Meeting', {})
    
    res['grandPrixName'] = meeting_data.get('Name', 'Unknown')
    res['country'] = meeting_data.get('Country', {}).get('Name', 'Unknown')
    
    session_type = session_raw_data.get('Type', 'Unknown')
    res['session'] = session_raw_data.get('Name', 'Unknown')
    
    # Qualifying handling
    session_part = timing_raw_data.get('SessionPart', '')
    if session_type == 'Qualifying':
        # In qualifying, entries marks the number of drivers that are allowed to qualify
        entries = timing_raw_data.get('NoEntries', [])[int(session_part) % 3]
    else:
        entries = 999

    # Race handling
    if session_type == 'Race':
        res['other'] = { 'currentLap': int(lapCount_raw_data.get('CurrentLap', 0)),
                         'totalLaps': int(lapCount_raw_data.get('TotalLaps', 0))}
        
    # Get car data
    car_data = decompressed_carData(car_raw_data)

    # Get evey driver's current result
    result_list = []
    for (driverNumber, data) in timing_raw_data.get('Lines').items():

        driver_timing_info = timing_raw_data.get('Lines', {}).get(driverNumber, {})
        driver_stats_info = stats_raw_data.get('Lines', {}).get(driverNumber, {})
        car_info = car_data.get(driverNumber, {}).get('Channels', {})

        driver_result = { 'driver': get_driver_info(driverNumber, drivers_raw_data),
                          'position': int(data.get('Position', 9999)),
                          'drspit': get_drspit_info(driver_timing_info, car_info),
                          'status': get_driver_status(driver_timing_info, entries),
                          'tire': get_current_tire_info(driverNumber, tire_raw_data),
                          'Gap': get_gap_info(driver_timing_info, session_type, session_part),
                          'lapTime': get_lap_info(driver_stats_info, driver_timing_info),
                          'sectors': get_sector_info(driver_stats_info, driver_timing_info)}
        
        result_list.append(driver_result)

    result_list.sort(key=lambda x: x['position'])
    res['results'] = result_list

    # Get the current track status
    res['trackStatus'] = { 'status': int(trackStatus_raw_data.get('Status', '0')),
                           'message': trackStatus_raw_data.get('Message', 'Unknown')}

    # Get the current weather info
    res['weather'] = get_weather_info(weather_raw_data)

    # Get the extrapolated clock info
    res['clock'] = get_extrapolated_clock(clock_raw_data)

    # Get the extrapolated clock info
    res['raceControlMessages'] = raceControlMessages_raw_data.get('Messages', [])[::-1]
    
    return res

if __name__ == '__main__':

    t = threading.Thread(target=wss.connect_wss, daemon=True)
    t.start()

    fastf1.Cache.enable_cache('cache')

    while True:
        print("Getting live timing data...")
        try:
            # res = get_live_timing()
            # print(*res['results'], sep='\n')
            print(wss.data_global.get('TeamRadio'))
            # raw_car_data = wss.data_global.get('CarData.z')
            # compressed_bytes = base64.b64decode(raw_car_data)
            # decompressed_data = zlib.decompress(compressed_bytes, -zlib.MAX_WBITS)
            # car_data = json.loads(decompressed_data.decode('utf-8'))
            # print(car_data)
        except Exception as e:
            print(f"Error getting live timing data: {e}")
            
        time.sleep(3)

    