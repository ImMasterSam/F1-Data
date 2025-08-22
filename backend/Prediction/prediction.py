import fastf1
from fastf1.events import Event
from fastf1.core import Session

from Data.driver import Driver
from Data.constructor import Constructor

from sys import argv
import datetime
from tqdm import tqdm

class Prediction:

    def __init__(self, season = 0, round = 0):
        self.season = season
        self.round = round

        if season == 0 or round == 0:
            self.event = self.get_last_round()
        else:
            self.event = fastf1.get_event(season, round)

        self.sessions = self.load_sessions()
        
        self.drivers = self.load_drivers()
        self.constructors = self.load_constructors()

    def get_last_round(self) -> Event:
        ''' Get the last round of the current season. '''
        current_time = datetime.datetime.now(tz=datetime.timezone.utc)
        self.season = current_time.year

        schedule = fastf1.get_event_schedule(self.season)

        # Iterate backwards through the rounds
        for round, event in list(schedule.iterrows())[::-1]:
            race_datetime = event['Session5DateUtc'].to_pydatetime()
            race_datetime_utc = race_datetime.replace(tzinfo=datetime.timezone.utc)
            
            # Check if the
            if current_time - race_datetime_utc > datetime.timedelta(hours=8):
                self.round = round
                return fastf1.get_event(self.season, round)
        
        raise ValueError(f"No past rounds found for season {self.season}.")
    
    def load_sessions(self) -> list[Session]:
        '''Load all sessions for the given season and round.'''

        SESSION_NUM = 5     # (Practice 1, Practice 2, Practice 3, Qualifying, Race)  
                            # (Practice 1, Sprint Qualifying, Sprint, Qualifying, Race)

        session_list = []

        for session_idx in tqdm(range(1, SESSION_NUM + 1), desc="Loading sessions"):
            session = self.event.get_session(session_idx)
            session.load(laps=True, telemetry=False, weather=False, messages=False)
            session_list.append(session)

        return session_list


    def load_constructors(self) -> dict[str, Constructor]:
        '''Load car performance for the given season and round.'''
        constructorID_list = set(self.drivers[driver].teamID for driver in self.drivers.keys())
        constructors: dict[str, Constructor] = {}

        # Iterate through all constructors
        for constructorID in tqdm(constructorID_list, desc="Loading constructors"):
            constructor = Constructor(self.season, self.round, constructorID)
            constructors[constructorID] = constructor

        return constructors
        
        
        
    def load_drivers(self) -> dict[int, Driver]:
        '''Load driver data for the given season and round.'''
        race = self.sessions[4]
        drivers: dict[int, Driver] = {}

        # Iterate through all drivers
        for driverNumber in tqdm(race.drivers, desc="Loading drivers"):
            driver = Driver(self.season, self.round, driverNumber)
            drivers[driverNumber] = driver

        return drivers
    
    
        


if __name__ == "__main__":

    # fastf1 settings
    fastf1.Cache.enable_cache('cache')  # replace 'cache' with your desired cache directory
    if len(argv) == 2 and argv[1] == '-d':
        pass
    else:
        fastf1.set_log_level('ERROR')

    # Testing
    prediction = Prediction()
    print(f"Loaded event: {prediction.event.get_race()} for season {prediction.season}, round {prediction.round}")
    print(prediction.sessions)
    print(prediction.drivers)
    print(prediction.constructors)
