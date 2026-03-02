import type { driverStanding_type } from '../../Type/StandingTypes.tsx';
import DriverStandingTable from './table/DriverStandingTable.tsx';

type Props = {
  driverStanding: Array<driverStanding_type>;
}

function DriverStanding({driverStanding}: Props) {

  return (
    <div className='standings'>
      {driverStanding && <DriverStandingTable driverStanding={driverStanding}/>}
    </div>
  )
}

export default DriverStanding
