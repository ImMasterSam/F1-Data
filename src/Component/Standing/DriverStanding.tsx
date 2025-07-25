import { useEffect, useState } from 'react';
import type { driverStanding_type } from '../../Type/StandingTypes.tsx';
import DriverStandingTable from './table/DriverStandingTable.tsx';

const requestOption = {
    method: 'GET',
    redirect: "follow" as RequestRedirect
}

async function getDriverStanding(year: number): Promise<Array<driverStanding_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/driverstandings`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  const standingList: Array<driverStanding_type> = jsonContent.MRData.StandingsTable.StandingsLists[0].DriverStandings
  console.log(standingList)

  return standingList
}

function DriverStanding() {

  const [driverStanding, setDriverStanding] = useState<Array<driverStanding_type>>([])
  const [errMessage, setErrMessage] = useState<string>('')

  useEffect(() => {
    getDriverStanding(2025).then((data) => {
      setDriverStanding(data)
    }).catch((error) => {setErrMessage(error)})
  }, [])

  return (
    <>
      {errMessage ? <h3>{errMessage}</h3>
      : <DriverStandingTable driverStanding={driverStanding}/>}
    </>
  )
}

export default DriverStanding
