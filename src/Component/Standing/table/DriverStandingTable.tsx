import { team_theme } from "../../../Lib/TeamTheme";
import type { driverStanding_type } from "../../../Type/StandingTypes";

type Props = {
  driverStanding: driverStanding_type[]
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
      ? <tr key={driver.position} onClick={() => {window.open(driver.Driver.url)}}>
        <td>{driver.position}</td>
        <td className="f1-style driverName-field" style={{textAlign: 'left'}}>
          <span>
            {driver.Driver.givenName + ' '}
            <span style={{color: team_theme[driver.Constructors[driver.Constructors.length - 1].constructorId], fontWeight: 'bold'}}>
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
    <table className="driverStanding-table">
      <DriverStandingTableHeader />          

      <DriverStandingTableBody driverStanding={driverStanding}/>

    </table>
  );
}

export default DriverStandingTable