import ReactCountryFlag from "react-country-flag";
import type { race_type } from "../../Type/RaceTypes";
import { Country } from "../../Lib/CountryCode";
import { getDateRange } from "../../Lib/Schedule/TimeHandler";

type Props = {
    race: race_type;
    setSelectedTrack: Function;
}

function ScheduleBlock({race, setSelectedTrack}: Props) {
  return <div className={`race-block ${race.status}`} onClick={() => {setSelectedTrack(race.round-1)}}>
    <div className="race-block-left">
      <div className="race-round-number">
        <h2>{race.round}</h2>
      </div>
      <div className="race-info">
        <div className="race-header">
          <ReactCountryFlag countryCode={Country[race.Circuit.Location.country]} 
          aria-label={race.Circuit.Location.country}
          style={{scale: 1.5}} svg />
          <h3>{race.raceName}</h3>
        </div>
        <p>{race.Circuit.circuitName}</p>
      </div>
    </div>

    <div className="race-date">
      <p>{getDateRange(race.date)}</p>
    </div>
  </div>
}

export default ScheduleBlock