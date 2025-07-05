import type { result_type } from "./Dashtypes"
import './Dashboard.css'
import Position from "./DashComponent/DashRowComponent/Position"
import Tire from "./DashComponent/DashRowComponent/Tire"
import Gap from "./DashComponent/DashRowComponent/Gap"
import LapTime from "./DashComponent/DashRowComponent/LapTime"
import Sector from "./DashComponent/DashRowComponent/Sector/Sector"

type Props = {
    result: result_type
}

function DashboardRow({ result }: Props) {
  return <div className={`dash-driver-row ${result.status.retired || result.status.stopped ? 'out' : ''}`} key={result.driver.driverNumber}>
    <Position driver={result.driver} position={result.position}/>
    <Tire tire={result.tire}/>
    <Gap gap={result.Gap} leading={result.position == 1}/>
    <LapTime lapTime={result.lapTime}/>
    {result.sectors.map((sector, index) => {
      return <Sector sector={sector} key={index}/>
    })}
  </div>
}

export default DashboardRow