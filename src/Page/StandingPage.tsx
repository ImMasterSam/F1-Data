import ConstructorStanding from "../Component/Standing/ConstructorStanding"
import DriverStanding from "../Component/Standing/DriverStanding"

function StandingPage() {
    return (
      <div className='standing-table'>
        <ConstructorStanding />
        <DriverStanding />      
      </div>
    )
}

export default StandingPage