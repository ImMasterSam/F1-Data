import { useEffect, useState } from "react"
import PointsDistribution from "../../Component/Standing/charts/PointsDistribution"
import PointsEvolution from "../../Component/Standing/charts/PointsEvolution"
import DriverStanding from "../../Component/Standing/DriverStanding"
import '../../CSS/Standings.css'
import type { driverStanding_type } from "../../Type/StandingTypes"
import { fetchScheduleList, getDriverStanding } from "../../Lib/Fetch"
import type { race_type } from "../../Type/RaceTypes"

function DriversPage() {

  const [driverStanding, setDriverStanding] = useState<Array<driverStanding_type>>([])
  const [schedule, setSchedule] = useState<Array<race_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')
  const year = 2024;

  useEffect(() => {
    getDriverStanding(year).then((data) => {
      setDriverStanding(data)
    }).catch((error) => {setErrMessage(error)})
    fetchScheduleList(year).then((data) => {
      setSchedule(data)
    }).catch((error) => {setErrMessage(error)})
  }, [year])

  return (
    <div className='standing-page'>
      <h2 className="standing-title">{year} Driver Championship Standings</h2>
      {errMessage ? <h3>{errMessage}</h3>
      :
      <div className="standing-container">
        <DriverStanding driverStanding={driverStanding}/>
        <div className="standing-chart">
          <PointsEvolution year={year} schedule={schedule} driverStanding={driverStanding}/>
          <PointsDistribution />
        </div>
      </div>}

    </div>
  )
}

export default DriversPage