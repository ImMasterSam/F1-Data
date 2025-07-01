import type { sectorInfo_type } from "../../Dashtypes";
import Segment from "./Segments";

type Props = {
    sector: sectorInfo_type;
}

function Sector({ sector }: Props) {
  return <div className="sector-feild">
    <Segment segments={sector.segments}/>
    <div className="sector-time">
      <h4>{sector.sectorLast}</h4>
      <p className="sector-best">{sector.sectorBest}</p>
    </div>
  </div>
}

export default Sector