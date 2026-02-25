import { useEffect, useState } from 'react';
import Schedule from '../Component/Schedule/Schedule'
import ScheduleHeader from '../Component/Schedule/ScheduleHeader'
import "../CSS/Page.css";
import { fetchYearList } from '../Lib/Fetch';
import type { yearlist_type } from '../Type/Scheduletypes';

function SchedulePage() {

  const [yearList, setYearList] = useState<Array<yearlist_type>>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [errMessage, setErrMessage] = useState<string>('')

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    console.log(year);
  }

  useEffect(() => {
      fetchYearList().then((data) => {
        handleSelectYear(data ? data.reverse()[0].season : 0)
        setYearList(data)
        console.log(selectedYear)
      }).catch((error) => {setErrMessage(error)})
    }, [])

  return (
    <div className='schedule'>
      <ScheduleHeader setSelectedYear={handleSelectYear} selectedYear={selectedYear} YearList={yearList}/>
      {errMessage ? <p>{errMessage}</p> : <Schedule year={selectedYear}/>}
    </div>
  )
}

export default SchedulePage