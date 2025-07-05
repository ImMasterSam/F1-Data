import Schedule from '../Component/Schedule/Schedule'
import ScheduleHeader from '../Component/Schedule/ScheduleHeader'
import "../CSS/Page.css";

function SchedulePage() {
  return <div className='schedule'>
    <ScheduleHeader />
    <Schedule />
  </div>
}

export default SchedulePage