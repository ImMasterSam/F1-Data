import fastf1
from fastf1.livetiming.data import LiveTimingData
from fastf1.core import Session, Lap

import pandas as pd
import datetime
import threading
import time

import wss

def get_live_timing_data():
    '''Get live timing data from websocket connection'''
    subscribe_msg = {
        "H": "Streaming",
        "M": "Subscribe",
        "A": [["Heartbeat"]],
        "I": 1
    }

def get_current_session(current_time: datetime.datetime) -> Session:
    """Get the current live session""" 
    schedule = fastf1.get_event_schedule(current_time.year)
    target_time = current_time + datetime.timedelta(minutes=5)  # Look for sessions starting within the last 15 minutes

    for round, event in schedule[::-1].iterrows():
        # print(event)

        for session in range(5, 0, -1):
            session_timestamp: pd.Timestamp = event[f'Session{session}Date']
            session_time = session_timestamp.to_pydatetime()
            session_time = session_time.astimezone(tz=datetime.timezone.utc) 
            if session_time <= target_time:
                return fastf1.get_session(current_time.year, event['RoundNumber'], session)
            
def get_driver_info(driver_number: str, drivers_raw_data: dict) -> dict:
    """Get the driver info for a given driver number"""

    driver_raw_data = drivers_raw_data.get(driver_number, {})

    driver_data = { 'driverNumber': int(driver_raw_data.get('RacingNumber', driver_number)),
                    'driverFullName': driver_raw_data.get('FullName', 'Unknown'),
                    'driverAbbreviation': driver_raw_data.get('Tla', '???'), 
                    'driverTeamColor': driver_raw_data.get('TeamColour', 'FFFFFF'),}

    return driver_data

def get_driver_status(driver_timing_info: dict) -> str:
    """Get the current status of a driver"""

    status = {'retired': driver_timing_info.get('Retired', True),
              'stopped': driver_timing_info.get('Stopped', True),}
    
    return status

def get_current_tire_info(driver_number: str, tire_raw_data: dict) -> dict:
    """Get the current tire info for a driver"""

    driver_tire_info = tire_raw_data.get('Lines', {}).get(driver_number, {})
    last_stint = driver_tire_info.get('Stints', {})[-1]

    tire_info = { 'compound': last_stint.get('Compound', 'Unknown'),
                  'laps': int(last_stint.get('TotalLaps', '999'))}
    
    return tire_info

def get_gap_info(driver_timing_info: dict, session: str) -> dict:
    """Get the current gap info for a driver to the leader and the driver in front"""

    if session == 'Race':
        gap_info = { 'toLeader': driver_timing_info.get('GapToLeader', '-- ---'),
                     'toFront': driver_timing_info.get('IntervalToPositionAhead', {'Value': '-- ---'}).get('Value', '-- ---')}
    else:
        # In qualifying, the gap info is in the stats
        driver_stats = driver_timing_info.get('Stats', {})[-1]

        gap_info = { 'toLeader': driver_stats.get('TimeDiffToFastest', '-- ---'),
                     'toFront': driver_stats.get('TimeDifftoPositionAhead', '-- ---')}
    
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
        sector_last = driver_timing_info.get(f'Sectors')[i]
        sector_best = driver_stats_info.get(f'BestSectors')[i]

        sector_data = { 'sectorLast': sector_last.get('Value'),
                        'sectorBest': sector_best.get('Value'),
                        'segments': [segment.get('Status') for segment in sector_last.get('Segments', [])]}

        sectors.append(sector_data)
    
    return sectors


def get_live_timing():

    # Load current session
    current_time = datetime.datetime.now(tz=datetime.timezone.utc)
    session = get_current_session(current_time)
    session.load(laps=True, weather=False, telemetry=False)

    res = dict()
    res['grandPrixName'] = session.event['EventName']
    res['session'] = session.name

    result_list = []
    
    try:
        drivers_raw_data: dict = wss.data_global.get('DriverList')
        timing_raw_data: dict = wss.data_global.get('TimingData')
        stats_raw_data: dict = wss.data_global.get('TimingStats')
        tire_raw_data: dict = wss.data_global.get('TimingAppData')
    except:
        print("No live data available yet")
        return res
    
    res['session'] += (f' Q{timing_raw_data.get('SessionPart')}' if session.name == 'Qualifying' else '')

    # Get evey driver's current result
    for (driverNumber, data) in timing_raw_data.get('Lines').items():

        driver_timing_info = timing_raw_data.get('Lines', {}).get(driverNumber, {})
        driver_stats_info = stats_raw_data.get('Lines', {}).get(driverNumber, {})

        driver_result = { 'driver': get_driver_info(driverNumber, drivers_raw_data),
                          'position': int(data.get('Position', 9999)),
                          'status': get_driver_status(driver_timing_info),
                          'tire': get_current_tire_info(driverNumber, tire_raw_data),
                          'Gap': get_gap_info(driver_timing_info, stats_raw_data.get('SessionType')),
                          'lapTime': get_lap_info(driver_stats_info, driver_timing_info),
                          'sectors': get_sector_info(driver_stats_info, driver_timing_info)}
        
        result_list.append(driver_result)

    result_list.sort(key=lambda x: x['position'])
    res['results'] = result_list
    
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
            print(wss.data_global.get('TimingStats'))
        except:
            pass
        time.sleep(3)

    