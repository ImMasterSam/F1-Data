import { team_theme } from "../Theme";
import type { driverStanding_type } from "../StandingTypes";
import './Table.css'

type Props = {
  driverStanding: Array<driverStanding_type>
}

function DriverStandingTableHeader() {
  return <thead>
    <tr>
      <th>Rank</th>
      <th>Driver</th>
      <th>Win(s)</th>
      <th>Points</th>
    </tr>
  </thead>
}

function DriverStandingTableBody({driverStanding}: Props) {
  return <tbody>
    {driverStanding.map((driver) => {
      return driver
      ? <tr key={driver.position}>
        <td>{driver.position}</td>
        <td className="f1-style driverName-field" style={{textAlign: 'left'}}>
          <span>
            {driver.Driver.givenName + ' '}
            <span style={{color: team_theme[driver.Constructors[0].constructorId], fontWeight: 'bold'}}>
              {driver.Driver.familyName.toUpperCase()}
            </span>
          </span>
        </td>
        <td>{driver.wins}</td>
        <td style={{fontWeight: 'bold'}}>{driver.points}</td>
      </tr>
      : <tr><td colSpan={4}>Loading ...</td></tr>
    })}   
  </tbody>
}

function DriverStandingTable({driverStanding}: Props) {
  return (
    <div className="standings">
      <h2 className="table-title">Driver Championship Standings</h2>
      <table className="driverStanding-table">
          <DriverStandingTableHeader />          

          <DriverStandingTableBody driverStanding={driverStanding}/>

      </table>
    </div>

  );
}

export default DriverStandingTable