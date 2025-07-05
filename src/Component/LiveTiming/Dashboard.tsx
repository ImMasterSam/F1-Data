import ReactCountryFlag from "react-country-flag";
import DashboardRow from "./DashboardRow";
import Weather from "./DashComponent/Weather";
import type { dashData_type } from "./Dashtypes"
import { Country } from "../Schedule/lib/CountryCode";
import TrackStatus from "./DashComponent/TrackStatus";
import CountDown from "./DashComponent/CountDown";

type dash_Props = {
  data: dashData_type | null;
  connectStatus: boolean;
}

type dashHeader_Props = {
  data: dashData_type
}

function DashboardHeader({ data }: dashHeader_Props) {
  return <div className="dash-header">
    <div className="grandPrix-title">
      <ReactCountryFlag countryCode={Country[data.country]} 
            aria-label={data.country}
            style={{scale: 2}} svg />
      <h2>{data.grandPrixName} - {data.session}</h2>
    </div>
    {data?.clock && <CountDown clock={data.clock}/>}
    {data?.trackStatus && <TrackStatus trackStatus={data.trackStatus}/>}
  </div>
}

function Dashboard({ data, connectStatus }: dash_Props) {
  return <div className="dashboard">
    {data?.grandPrixName && <DashboardHeader data={data}/>}
    {data?.weather && <Weather weather={data?.weather}/>}
    <div className="drivers-table">
      {data?.results ? data.results.map((result) => {
        return <DashboardRow result={result} key={result.driver.driverNumber}/>
      }) : <p>Loading Data ...</p>}
    </div>
    <p>Connect Status: {connectStatus ? 'Connected' : 'Connecting ...'}</p>
  </div>
}

export default Dashboard