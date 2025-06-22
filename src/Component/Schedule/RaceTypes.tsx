export type datetime_type = {
    date: string;
    time: string;
}

export type location_type = {
    lat: number;
    long: number;
    locality: string;
    country: string;
}

export type circuit_type = {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: location_type;
}

export type race_normal_type = {
    season: number;
    round: number;
    url: string;
    raceName: string;
    Circuit: circuit_type;
    date: string;
    time: string;
    FirstPractice: datetime_type;
    SecondPractice: datetime_type;
    ThirdPractice: datetime_type;
    Qualifying: datetime_type;
}

export type race_sprint_type = {
    season: number;
    round: number;
    url: string;
    raceName: string;
    Circuit: circuit_type;
    date: string;
    time: string;
    FirstPractice: datetime_type;
    SprintQualifying: datetime_type;
    Sprint: datetime_type;
    Qualifying: datetime_type;
}

export type race_type = race_normal_type | race_sprint_type

