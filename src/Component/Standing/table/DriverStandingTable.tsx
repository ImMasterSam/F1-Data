import type { driverStanding_type } from "../Types";
import './Table.css'

type Props = {
  driverStanding: Array<driverStanding_type>
}

function DriverStandingTable({driverStanding: constructorStanding}: Props) {
  return (
    <div className="standings">
      <h2 className="table-title">Driver Championship Standings</h2>
      <table className="driverStanding-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Driver</th>
              <th>Win(s)</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {constructorStanding.map((constructor) => {
              return <tr key={constructor.position}>
                <td>{constructor.position}</td>
                <td>{constructor.Driver.familyName}</td>
                <td>{constructor.wins}</td>
                <td>{constructor.points}</td>
              </tr>
            })}   
          </tbody>

      </table>
    </div>

  );
}

export default DriverStandingTable