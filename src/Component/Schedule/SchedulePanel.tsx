import type { race_type } from "../../Type/RaceTypes";
import RaceInfo from "./Panel/RaceInfo";
import TrackMap from "./Panel/TrackMap";

type Props = {
  race: race_type
}

function SchedulePanel({race}: Props) {
  return (
    <div className="schedule-panel">
      {race ? <RaceInfo race={race}/> : <></>}
      {race ? <TrackMap race={race}/> : <></>}
    </div>
  )
}

export default SchedulePanel;