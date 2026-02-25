import { useState, useEffect } from "react";
import type { race_type } from "../../Type/RaceTypes";
import ScheduleBlock from "./ScheduleBlock";
import '../../CSS/Schedule.css'
import { fetchScheduleList } from "../../Lib/Fetch";
import SchedulePanel from "./SchedulePanel";

type Props = {
  year: number
}

function Schedule({year}: Props) {
  const [scheduleList, setSchedulelist] = useState<Array<race_type>>([])
  const [selectedTrack, setSelectedTrack] = useState<number>(0)
  const [errMessage, setErrMessage] = useState<string>('')

  const handleSelectedTrack = (idx: number) => {
    setSelectedTrack(idx)
  }

  useEffect(() => {
    fetchScheduleList(year).then((data) => {
      setSchedulelist(data)
    }).catch((error) => {setErrMessage(error)})
  }, [year])

  return (
    <div className="schedule-container">
      {scheduleList ? <SchedulePanel race={scheduleList[selectedTrack]}/> : <p>Loading</p>}
      <div className="schedule-grid">
        {errMessage ? <h3>{errMessage}</h3>
        : scheduleList.map((race) => { 
          return race 
          ? <ScheduleBlock race={race} key={race.round} setSelectedTrack={handleSelectedTrack}/> 
          : <p>Loading ...</p>})}
      </div>

    </div>
  )
}

export default Schedule