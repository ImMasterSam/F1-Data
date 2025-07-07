import { useState, useEffect } from "react";
import type { race_type } from "../../Type/RaceTypes";
import ScheduleBlock from "./ScheduleBlock";
import '../../CSS/Schedule.css'
import { setRaceStatus } from "../../Lib/Schedule/ScheduleHandler";

const requestOption = {
    method: 'GET',
    redirect: "follow" as RequestRedirect
} 

async function getScheduleList(year: number): Promise<Array<race_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/races/`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  let scheduleList: Array<any> = jsonContent.MRData.RaceTable.Races
  console.log(scheduleList)

  scheduleList = setRaceStatus(scheduleList)

  return scheduleList
}

function Schedule() {
  const [scheduleList, setSchedulelist] = useState<Array<race_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')

  useEffect(() => {
    getScheduleList(2025).then((data) => {
      setSchedulelist(data)
    }).catch((error) => {setErrMessage(error)})
  }, [])

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