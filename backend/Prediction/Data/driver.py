import fastf1

class Driver:

    def __init__(self, season: int, round: int, driverNumber: int):
        self.season = season
        self.round = round
        self.driverNumber = driverNumber

        self.load_driver_info()

    def load_driver_info(self):
        ''' Load driver information from fastf1 '''
        session = fastf1.get_session(self.season, self.round, 'R')
        session.load(laps=False, telemetry=False, weather=False, messages=False)
        driver_info = session.get_driver(self.driverNumber)

        self.fullName = driver_info['FullName']
        self.abbreviation = driver_info['Abbreviation']
        self.driverID = driver_info['DriverId']
        self.teamName = driver_info['TeamName']
        self.teamID = driver_info['TeamId']
        self.nationality = driver_info['CountryCode']

    def __repr__(self) -> str:
        return f"{self.teamName} - {self.fullName}"