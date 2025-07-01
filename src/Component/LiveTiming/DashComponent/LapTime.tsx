import type { lapInfo_type, lapStatus_type } from "../Dashtypes";

type Props = {
    lapTime: lapInfo_type;
}

const lastLap_color = (lastLap: lapStatus_type) => {
  if (lastLap.overallFastest)
    return '#7a22fe'
  else if (lastLap.personalFastest)
    return '#01a656'
  else
    return '#ffffff'
}

const bestLap_color = (lastLap: lapStatus_type) => {
  if (lastLap.overallFastest)
    return '#7a22fe'
  else
    return '#ffffff'
}

function LapTime({ lapTime }: Props) {
  return <div className="laptime-field">
    <h4 style={{color: `${lastLap_color(lapTime.lastLap)}`}}>{lapTime.lastLap.lapTime}</h4>
    <p className={`laptime-best ${lapTime.bestLap.overallFastest ? 'fastest' : ''}`} style={{color: `${bestLap_color(lapTime.bestLap)}`}}>{lapTime.bestLap.lapTime}</p>
  </div>
}

export default LapTime