import DashboardRow from "./DashboardRow";
import type { dashData_type } from "./Dashtypes"

type Props = {
  data: dashData_type | null;
  connectStatus: boolean;
}

function Dashboard({ data, connectStatus }: Props) {
  return <>
    <h2>{data?.grandPrixName} - {data?.session}</h2>
    {data?.results.map((result) => {
      return <DashboardRow result={result} key={result.driver.driverNumber}/>
    })}
    <p>Connect Status: {connectStatus ? 'Connected' : 'Connecting ...'}</p>
  </>
}

export default Dashboard