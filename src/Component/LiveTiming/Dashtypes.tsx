export type timeInfo_type = {
  current: number | null;
  fastest: number | null;
}

export type driver_type = {
  driverNumber: number;
  driverFullName: string;
  driverAbbreviation: string;
  driverTeamColor: string;
}

export type result_type = {
  driver: driver_type;
  driverStatus: string;
  position: number;
  lapTimeInfo: timeInfo_type;
}

export type dashData_type = {
  grandPrixName: string;
  session: string;
  drivers: number[];
  results: result_type[];
}