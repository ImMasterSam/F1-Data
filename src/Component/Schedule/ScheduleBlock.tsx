import ReactCountryFlag from "react-country-flag";
import type { race_type } from "./RaceTypes"
import { Country } from "./CountryCode";

type Props = {
    race: race_type;
}

function ScheduleBlock({race}: Props) {
  return <div className="race-block">
    <div className="race-header">
      <ReactCountryFlag countryCode={Country[race.Circuit.Location.country]} svg />
      <h3>{race.raceName}</h3>
    </div>
    <p>{race.Circuit.circuitName}</p>
  </div>
}

export default ScheduleBlock