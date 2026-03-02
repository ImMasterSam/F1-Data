import PointsDistribution from "../../Component/Standing/charts/PointsDistribution"
import PointsEvolution from "../../Component/Standing/charts/PointsEvolution"
import ConstructorStanding from "../../Component/Standing/ConstructorStanding"
import '../../CSS/Standings.css'

function ConstructorsPage() {
  return (
    <div className='standing-page'>
      <h2 className="standing-title">Constructor Championship Standings</h2>
      <div className="standing-container">
        <ConstructorStanding />
        <div className="standing-chart">
          <PointsEvolution />
          <PointsDistribution />
        </div>
      </div>
    </div>
  )
}

export default ConstructorsPage