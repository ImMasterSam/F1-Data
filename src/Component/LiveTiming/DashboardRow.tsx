import type { result_type } from "../../Type/Dashtypes"
import Position from "./DashComponent/DashRowComponent/Position"
import Tire from "./DashComponent/DashRowComponent/Tire"
import Gap from "./DashComponent/DashRowComponent/Gap"
import LapTime from "./DashComponent/DashRowComponent/LapTime"
import Sector from "./DashComponent/DashRowComponent/Sector/Sector"
import DrsPit from "./DashComponent/DashRowComponent/DrsPit"

type Props = {
    result: result_type
}

const isOut = (result: result_type) => {
  if (result.status.retired || result.status.stopped || result.status.knockedOut)
    return true
  else
    return false
}

const isDanger = (result: result_type) => {
  if (result.status.danger)
    return true
  else
    return false
}

function DashboardRow({ result }: Props) {
  return <div className={`dash-driver-row ${isOut(result) ? 'out' : ''} ${isDanger(result) ? 'danger' : ''}`} key={result.driver.driverNumber}>
    <Position driver={result.driver} position={result.position}/>
    <DrsPit drspit={result.drspit}/>
    <Tire tire={result.tire}/>
    <Gap gap={result.Gap} leading={result.position == 1}/>
    <LapTime lapTime={result.lapTime}/>
    {result.sectors.map((sector, index) => {
      return <Sector sector={sector} key={index}/>
    })}
  </div>
}

export default DashboardRow