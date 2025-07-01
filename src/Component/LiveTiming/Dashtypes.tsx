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

export type lapInfo_type = {
  lastLap: string;
  bestLap: string;
}

export type sectorInfo_type = {
  sectorLast: string;
  sectorBest: string;
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

export type dashData_type = {
  grandPrixName: string;
  session: string;
  results: result_type[];
}