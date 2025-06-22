import type { constructorStanding_type } from "../Types";
import './Table.css'

type Props = {
  constructorStanding: Array<constructorStanding_type>
}

function ConstructorStandingTable({constructorStanding}: Props) {
  return (
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
            return <tr key={constructor.position}>
              <td>{constructor.position}</td>
              <td>{constructor.Constructor.name}</td>
              <td>{constructor.wins}</td>
              <td>{constructor.points}</td>
            </tr>
          })}   
        </tbody>

    </table>
  );
}

export default ConstructorStandingTable