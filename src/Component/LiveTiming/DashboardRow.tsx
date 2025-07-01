import type { result_type } from "./Dashtypes"
import './Dashboard.css'
import Position from "./DashComponent/Position"
import Tire from "./DashComponent/Tire"
import Gap from "./DashComponent/Gap"
import LapTime from "./DashComponent/LapTime"
import Sector from "./DashComponent/Sector/Sector"

type Props = {
    result: result_type
}

function DashboardRow({ result }: Props) {
  return <div className={`dash-driver-row ${result.status.retired || result.status.stopped ? 'out' : ''}`} key={result.driver.driverNumber}>
    <Position driver={result.driver} position={result.position}/>
    <Tire tire={result.tire}/>
    <Gap gap={result.Gap} leading={result.position == 1}/>
    <LapTime lapTime={result.lapTime}/>
    {result.sectors.map((sector) => {
      return <Sector sector={sector}/>
    })}
  </div>
}

export default DashboardRow