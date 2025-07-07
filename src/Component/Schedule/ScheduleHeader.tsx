import { useEffect, useState } from "react"
import { getTimeString } from "../../Lib/Schedule/TimeHandler"

function ScheduleHeader() {

  const [clock, setClock] = useState<string>(getTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <div className="schedule-header">
    <h2 style={{padding: '15px 10px'}}>2025 F1 Race Calender</h2>
    <h3>{clock}</h3>
  </div>
}

export default ScheduleHeader