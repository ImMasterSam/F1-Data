import { useEffect, useState } from "react"
import { getTimeString } from "../../Lib/Schedule/TimeHandler"

type Props = {
  setSelectedYear: Function
}

function ScheduleHeader({setSelectedYear}: Props) {

  const [clock, setClock] = useState<string>(getTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <div className="schedule-header">
    <div className="schedule-header-title">
      <select onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="2026">2026</option>
        <option value="2025">2025</option>
      </select>
      <p>F1 Race Calender</p>
    </div>
    <h3>{clock}</h3>
  </div>
}

export default ScheduleHeader