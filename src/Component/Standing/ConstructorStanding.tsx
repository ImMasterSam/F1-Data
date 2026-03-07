import type { constructorStanding_type } from '../../Type/StandingTypes.tsx';
import ConstructorStandingTable from './table/ConstructorStandingTable.tsx';

type Props = {
  constructorStanding: Array<constructorStanding_type>;
}

function ConstructorStanding({constructorStanding}: Props) {
  return (
    <div className='standings'>
      {constructorStanding && <ConstructorStandingTable constructorStanding={constructorStanding}/>}
    </div>
  )
}

export default ConstructorStanding
