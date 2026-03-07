import PointsEvolution from "../../Component/Standing/charts/PointsEvolution"
import ConstructorStanding from "../../Component/Standing/ConstructorStanding"
import '../../CSS/Standings.css'
import type { constructorStanding_type } from "../../Type/StandingTypes"
import { useEffect, useState } from "react"
import type { race_type } from "../../Type/RaceTypes"
import RankEvolution from "../../Component/Standing/charts/RankEvolution"
import { fetchScheduleList, getConstructorStanding } from "../../Lib/Fetch"

function ConstructorsPage() {

  const [constructorStanding, setConstructorStanding] = useState<Array<constructorStanding_type>>([])
  const [schedule, setSchedule] = useState<Array<race_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')
  const year = 2025;

  useEffect(() => {
    getConstructorStanding(year).then((data) => {
      console.log('constructor standings: ', data)
      setConstructorStanding(data)
    }).catch((error) => {setErrMessage(error)})
    fetchScheduleList(year).then((data) => {
      setSchedule(data)
    }).catch((error) => {setErrMessage(error)})
  }, [year])

  return (
    <div className='standing-page'>
      <h2 className="standing-title">{year} Constructor Championship Standings</h2>
      {errMessage ? <h3>{errMessage}</h3>
      :
      <div className="standing-container">
        <ConstructorStanding constructorStanding={constructorStanding} />
        <div className="standing-chart">
          <PointsEvolution type='constructor' year={year} schedule={schedule} standing={constructorStanding}/>
          <RankEvolution type='constructor' year={year} schedule={schedule} standing={constructorStanding}/>
        </div>
      </div>}

    </div>
  )
}

export default ConstructorsPage