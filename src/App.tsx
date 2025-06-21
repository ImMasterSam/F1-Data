import { useEffect, useState } from 'react';
import './App.css'

async function getDriverData(src: string): Promise<Array<any>> {
  const response = await fetch(src);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const content = await response.json()
  console.log(content);
  
  return content
}

function App() {

  const srcURL = 'https://api.openf1.org/v1/drivers?session_key=9158'
  const [driverData, setDriverData] = useState<Array<any>>()

  useEffect(() => {
    getDriverData(srcURL).then((data) => {
      setDriverData(data)
    })
  }, [])

  return (
    <>
      <h1>F1 Dashboard</h1>
      {driverData?.map((driver) => {
        return driver 
        ? <p>{driver.full_name}</p>
        : <p>Loading ...</p>
      })}
    </>
  )
}

export default App
