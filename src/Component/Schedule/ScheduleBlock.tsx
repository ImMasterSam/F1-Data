import ReactCountryFlag from "react-country-flag";
import type { race_type } from "../../Type/RaceTypes";
import { Country } from "../../Lib/CountryCode";
import { getDateRange } from "../../Lib/Schedule/TimeHandler";

type Props = {
    race: race_type;
}

function ScheduleBlock({race}: Props) {
  return <div className={`race-block ${race.status}`} onClick={() => {window.open(race.url, '_blank')}}>
    <div className="race-info">
      <div className="race-header">
        <ReactCountryFlag countryCode={Country[race.Circuit.Location.country]} 
        aria-label={race.Circuit.Location.country}
        style={{scale: 1.5}} svg />
        <h3>{race.raceName}</h3>
      </div>
      <p>{race.Circuit.circuitName}</p>
    </div>
    <div className="race-date">
      <p>{getDateRange(race.FirstPractice.date, race.date)}</p>
    </div>
  </div>
}

export default ScheduleBlock