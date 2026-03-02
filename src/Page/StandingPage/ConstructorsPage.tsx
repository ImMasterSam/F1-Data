import PointsDistribution from "../../Component/Standing/charts/RankEvolution"
import PointsEvolution from "../../Component/Standing/charts/PointsEvolution"
import ConstructorStanding from "../../Component/Standing/ConstructorStanding"
import '../../CSS/Standings.css'

function ConstructorsPage() {

  const year = 2025;

  return (
    <div className='standing-page'>
      <h2 className="standing-title">{year} Constructor Championship Standings</h2>
      <div className="standing-container">
        <ConstructorStanding year={year} />
        <div className="standing-chart">
          <PointsEvolution />
          <PointsDistribution />
        </div>
      </div>
    </div>
  )
}

export default ConstructorsPage