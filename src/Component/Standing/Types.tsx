export type constructor_type = {
  constructorId: string;
  name: string;
  nationality: string;
  url: string
}

export type driver_type = {
  driverId: string;
  permanentNumber: number;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export type constructorStanding_type = {
  Constructor: constructor_type;
  points: number;
  position: number;
  positiontext: string;
  wins: number
}


export type driverStanding_type = {
  Driver: driver_type;
  Constructors: constructor_type[];
  points: number;
  position: number;
  positiontext: string;
  wins: number
}