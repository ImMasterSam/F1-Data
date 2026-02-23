import { useEffect, useState } from 'react';
import Schedule from '../Component/Schedule/Schedule'
import ScheduleHeader from '../Component/Schedule/ScheduleHeader'
import "../CSS/Page.css";

function SchedulePage() {

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    console.log(year);
    
  }

  return <div className='schedule'>
    <ScheduleHeader setSelectedYear={handleSelectYear}/>
    <Schedule year={selectedYear}/>
  </div>
}

export default SchedulePage