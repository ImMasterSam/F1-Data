import type { driver_type } from "../../../../Type/Dashtypes";

type Props = {
    driver: driver_type;
    position: number;
}

function Position({ driver, position }: Props) {
  return <div className="position-feild">
    <h3 style={{width: '20%', marginRight: '20px'}}>{position}</h3>
    <h3 style={{color: `#${driver.driverTeamColor}`, fontFamily: 'F1'}} title={driver.driverFullName}>{driver.driverAbbreviation}</h3>
  </div>
}

export default Position