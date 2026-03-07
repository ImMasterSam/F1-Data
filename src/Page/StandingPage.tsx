import ConstructorStanding from "../Component/Standing/ConstructorStanding"
import DriverStanding from "../Component/Standing/DriverStanding"
import "../CSS/Page.css";

function StandingPage() {
    return (
      <div className='standing-table'>
        <ConstructorStanding />
        <DriverStanding />      
      </div>
    )
}

export default StandingPage