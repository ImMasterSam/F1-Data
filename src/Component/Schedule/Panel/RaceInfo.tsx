import type { race_type } from "../../../Type/RaceTypes";

type Props = {
  race: race_type
}

function RaceInfo({race}: Props) {
  return (
    <div className="schedule-raceinfo">
      <h2>{race.raceName}</h2>
    </div>
  )
}

export default RaceInfo;