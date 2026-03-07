import { useEffect, useState } from 'react';
import type { constructorStanding_type } from '../../Type/StandingTypes.tsx';
import ConstructorStandingTable from './table/ConstructorStandingTable.tsx';

const requestOption = {
    method: 'GET',
    redirect: "follow" as RequestRedirect
}

async function getConstructorStanding(year: number): Promise<Array<constructorStanding_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  const standingList: Array<any> = jsonContent.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
  console.log(standingList)

  return standingList
}

function ConstructorStanding() {
  
  const [constructorStanding, setConstructorStanding] = useState<Array<constructorStanding_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')

  useEffect(() => {
    getConstructorStanding(2025).then((data) => {
      setConstructorStanding(data)
    }).catch((error) => {setErrMessage(error)})
  }, [])

  return (
    <>
      {errMessage ? <h3>{errMessage}</h3>
      : <ConstructorStandingTable constructorStanding={constructorStanding}/>}
    </>
  )
}

export default ConstructorStanding
