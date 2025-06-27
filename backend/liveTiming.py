import fastf1
from fastf1.livetiming.data import LiveTimingData
from fastf1.core import Session, Lap

import pandas as pd
import datetime

def get_current_session(current_time: datetime.datetime) -> Session:
    """Get the current live session""" 
    schedule = fastf1.get_event_schedule(current_time.year)
    target_time = current_time + datetime.timedelta(minutes=15)  # Look for sessions starting within the last 15 minutes

    for round, event in schedule[::-1].iterrows():
        # print(event)

        for session in range(5, 0, -1):
            session_timestamp: pd.Timestamp = event[f'Session{session}Date']
            session_time = session_timestamp.to_pydatetime()
            session_time = session_time.astimezone(tz=datetime.timezone.utc) 
            if session_time <= target_time:
                return fastf1.get_session(current_time.year, event['RoundNumber'], session)

def get_last_lap_time(driver: str, session: Session) -> dict[str, Lap]:
    '''Get the last lap time for a given driver in the current session'''
    
    laps = session.laps.pick_drivers(driver['Abbreviation'])
    if laps.empty or laps.size < 2:
        current_laptime = None
    else:
        if laps.iloc[-1]['LapTime'] is not None:
            current_laptime = laps.iloc[-1]
        else:
            current_laptime = laps.iloc[-2]

    fastest_lap = laps.pick_fastest()
    if not fastest_lap.empty:
        fastest_lap_laptime = fastest_lap.iloc[0]['LapTime']
    else:
        fastest_lap_laptime = None

    res = {'current': current_laptime.total_seconds() if current_laptime is not None else None,
           'fastest': fastest_lap_laptime.total_seconds() if current_laptime is not None else None}

    return res


def get_live_timing():

    # Load current session
    current_time = datetime.datetime.now(tz=datetime.timezone.utc)
    session = get_current_session(current_time)
    session.load(laps=True, weather=False, telemetry=False)

    result = session.results
    result_list = []

    # Get evey driver's current result
    for idx, (number, driver) in enumerate(result.iterrows()):

        # Load lap time
        lapTime = get_last_lap_time(driver, session)

        driver_data = { 'driverNumber': driver['DriverNumber'],
                        'driverFullName': driver['FullName'],
                        'driverAbbreviation': driver['Abbreviation'],
                        'driverTeamColor': driver['TeamColor'],}

        driver_result = { 'driver': driver_data,
                          'driverStatus': driver['Status'],
                          'position': idx + 1,
                          'lapTimeInfo': lapTime}
        
        result_list.append(driver_result)

    res = dict()
    res['drivers'] = session.drivers
    res['grandPrixName'] = session.event['EventName']
    res['session'] = session.name
    res['results'] = result_list
    
    return res

if __name__ == '__main__':
    fastf1.Cache.enable_cache('cache', force_renew=True)

    res = get_live_timing()
    print(res['drivers'])
    print(*res['results'], sep='\n')