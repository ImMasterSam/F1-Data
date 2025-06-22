import type { constructorStanding_type } from "../StandingTypes";
import './Table.css'

type Props = {
  constructorStanding: Array<constructorStanding_type>
}

function ConstructorStandingTable({constructorStanding}: Props) {
  return (
    <div className="standings">
      <h2 className="table-title">Constructor Championship Standings</h2>
      <table className="constructorStanding-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Constructor</th>
              <th>Win(s)</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {constructorStanding.map((constructor) => {
              return constructor 
              ? <tr key={constructor.position}>
                <td>{constructor.position}</td>
                <td>
                  <img src={`${import.meta.env.BASE_URL}/team-logo/${constructor.Constructor.constructorId}.png`} alt={constructor.Constructor.constructorId} className="team-logo" />
                  <p className="f1-style">{constructor.Constructor.name}</p>
                </td>
                <td>{constructor.wins}</td>
                <td style={{fontWeight: 'bold'}}>{constructor.points}</td>
              </tr>
              : <tr>Loading ...</tr>
            })}   
          </tbody>

      </table>
    </div>

  );
}

export default ConstructorStandingTable