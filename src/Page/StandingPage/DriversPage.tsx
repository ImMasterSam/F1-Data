import PointsDistribution from "../../Component/Standing/charts/PointsDistribution"
import PointsEvolution from "../../Component/Standing/charts/PointsEvolution"
import DriverStanding from "../../Component/Standing/DriverStanding"
import '../../CSS/Standings.css'

function DriversPage() {
  return (
    <div className='standing-page'>
      <h2 className="standing-title">Driver Championship Standings</h2>
      <div className="standing-container">
        <DriverStanding />
        <div className="standing-chart">
          <PointsEvolution />
          <PointsDistribution />
        </div>
      </div>
    </div>
  )
}

export default DriversPage