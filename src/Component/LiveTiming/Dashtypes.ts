export type driver_type = {
  driverNumber: number;
  driverFullName: string;
  driverAbbreviation: string;
  driverTeamColor: string;
}

export type statusInfo_type = {
  retired: boolean;
  stopped: boolean;
}

export type tireInfo_type = {
  compound: string;
  laps: number;
}

export type gapInfo_type = {
  toLeader: string;
  toFront: number;
}

export type lapStatus_type = {
  lapTime: string;
  overallFastest: boolean;
  personalFastest: boolean;
}

export type lapInfo_type = {
  lastLap: lapStatus_type;
  bestLap: lapStatus_type;
}

export type sectorStatus_type = {
  sectorTime: string;
  previousSectorTime: string;
  overallFastest: boolean;
  personalFastest: boolean;
}

export type sectorInfo_type = {
  sectorLast: sectorStatus_type;
  sectorBest: sectorStatus_type;
  segments: number[];
}

export type result_type = {
  driver: driver_type;
  position: number;
  status: statusInfo_type;
  tire: tireInfo_type;
  Gap: gapInfo_type;
  lapTime: lapInfo_type;
  sectors: sectorInfo_type[];
}

export type weather_type = {
  airTemp: number;
  humidity: number;
  pressure: number;
  rainfall: boolean;
  trackTemp: number;
  windDirection: number;
  windSpeed: number;
}

export type trackStatus_type = {
  status: number; 
  message: string; 
}

export type dashData_type = {
  grandPrixName: string;
  session: string;
  country: string;
  results: result_type[];
  weather: weather_type;
  trackStatus: trackStatus_type;
}