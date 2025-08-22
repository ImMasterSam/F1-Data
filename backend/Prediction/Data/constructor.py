import fastf1
from fastf1.ergast import Ergast

import pandas as pd

ergast: Ergast = Ergast()

class Constructor:

    def __init__(self, season: int, round: int, constructorID: int):
        self.season = season
        self.round = round
        self.constructorID = constructorID

        self.load_constructor_info()

    def load_constructor_info(self):
        constructorData: pd.DataFrame = ergast.get_constructor_info(self.season, self.round, constructor=self.constructorID)
        
        self.name = constructorData.iloc[0]['constructorName']
        self.nationality = constructorData.iloc[0]['constructorNationality']

    def __repr__(self) -> str:
        return f"{self.name} ({self.nationality})"
    
