import { useEffect, useState } from 'react';
import type { constructorStanding_type } from '../../Type/StandingTypes.tsx';
import ConstructorStandingTable from './table/ConstructorStandingTable.tsx';
import { getConstructorStanding } from '../../Lib/Fetch.ts';

type Props = {
  year: number;
}

function ConstructorStanding({year}: Props) {
  
  const [constructorStanding, setConstructorStanding] = useState<Array<constructorStanding_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')

  useEffect(() => {
    getConstructorStanding(year).then((data) => {
      setConstructorStanding(data)
    }).catch((error) => {setErrMessage(error)})
  }, [])

  return (
    <div className='standings'>
      {errMessage ? <h3>{errMessage}</h3>
      : <ConstructorStandingTable constructorStanding={constructorStanding}/>}
    </div>
  )
}

export default ConstructorStanding
