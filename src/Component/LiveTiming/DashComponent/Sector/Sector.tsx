import type { sectorInfo_type, sectorStatus_type } from "../../Dashtypes";
import Segment from "./Segments";

type Props = {
    sector: sectorInfo_type;
}

const lastSector_color = (lastSector: sectorStatus_type) => {
  if (lastSector.overallFastest)
    return '#7a22fe'
  else if (lastSector.personalFastest)
    return '#01a656'
  else
    return '#ffffff'
}

const bestSector_color = (bestSector: sectorStatus_type) => {
  if (bestSector.overallFastest)
    return '#7a22fe'
  else
    return '#ffffff'
}

function Sector({ sector }: Props) {
  return <div className="sector-feild">
    <Segment segments={sector.segments}/>
    <div className="sector-time">
      <h4 style={{color: `${lastSector_color(sector.sectorLast)}`}}>{sector.sectorLast.sectorTime}</h4>
      <p className={`laptime-best ${sector.sectorBest.overallFastest ? 'fastest' : ''}`} style={{color: `${bestSector_color(sector.sectorBest)}`}}>{sector.sectorBest.sectorTime}</p>
    </div>
  </div>
}

export default Sector