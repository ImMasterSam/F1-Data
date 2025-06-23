import type { constructorStanding_type } from "../StandingTypes";
import './Table.css'

type Props = {
  constructorStanding: Array<constructorStanding_type>
}

function ConstructorStandingTableHeader() {
  return <thead>
    <tr>
      <th>Rank</th>
      <th>Constructor</th>
      <th>Win(s)</th>
      <th>Points</th>
    </tr>
  </thead>
}

function ConstructorStandingTableBody({constructorStanding}: Props) {
  return <tbody>
    {constructorStanding.map((constructor) => {
      return constructor 
      ? <tr key={constructor.position} onClick={() => {window.open(constructor.Constructor.url)}}>
        <td>{constructor.position}</td>
        <td className="constructorName-field">
          <img src={`${import.meta.env.BASE_URL}/team-logo/${constructor.Constructor.constructorId}.png`} alt={constructor.Constructor.constructorId} className="team-logo" />
          <p className="f1-style">{constructor.Constructor.name}</p>
        </td>
        <td>{constructor.wins}</td>
        <td style={{fontWeight: 'bold'}}>{constructor.points}</td>
      </tr>
      : <tr><td colSpan={4}>Loading ...</td></tr>
    })}   
  </tbody>
}

function ConstructorStandingTable({constructorStanding}: Props) {
  return (
    <div className="standings">
      <h2 className="table-title">Constructor Championship Standings</h2>
      <table className="constructorStanding-table">
          <ConstructorStandingTableHeader />
          <ConstructorStandingTableBody constructorStanding={constructorStanding} />
      </table>
    </div>

  );
}

export default ConstructorStandingTable