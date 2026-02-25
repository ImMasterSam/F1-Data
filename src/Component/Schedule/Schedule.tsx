import { useState, useEffect } from "react";
import type { race_type } from "../../Type/RaceTypes";
import ScheduleBlock from "./ScheduleBlock";
import '../../CSS/Schedule.css'
import { fetchScheduleList } from "../../Lib/Fetch";

type Props = {
  year: number
}

function Schedule({year}: Props) {
  const [scheduleList, setSchedulelist] = useState<Array<race_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')

  useEffect(() => {
    fetchScheduleList(year).then((data) => {
      setSchedulelist(data)
    }).catch((error) => {setErrMessage(error)})
  }, [year])

  return (
    <div className="race-container">
      {errMessage ? <h3>{errMessage}</h3>
      : scheduleList.map((race) => { 
        return race 
        ? <ScheduleBlock race={race} key={race.round}/> 
        : <p>Loading ...</p>})}
    </div>
  )
}

export default Schedule