import Schedule from '../Component/Schedule/Schedule'
import './Page.css'

function SchedulePage() {
  return <div className='schedule'>
    <h2 style={{padding: '15px 10px'}}>2025 F1 Race Calender</h2>
    <Schedule />
  </div>
}

export default SchedulePage