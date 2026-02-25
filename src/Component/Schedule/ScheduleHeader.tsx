import { useEffect, useState } from "react"
import { getTimeString } from "../../Lib/Schedule/TimeHandler"
import type { yearlist_type } from "../../Type/Scheduletypes"

type Props = {
  selectedYear: number
  setSelectedYear: Function
  YearList: Array<yearlist_type>
}

function ScheduleHeader({selectedYear, setSelectedYear, YearList}: Props) {

  const [clock, setClock] = useState<string>(getTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <div className="schedule-header">
    <div className="schedule-header-title">
      <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
        {YearList ? YearList.map((Year) => {
          return <option key={Year.season} value={Year.season}>{Year.season}</option>
        })
        : <option>NaN</option>}
      </select>
      <p>F1 Race Calender</p>
    </div>
    <h3>{clock}</h3>
  </div>
}

export default ScheduleHeader