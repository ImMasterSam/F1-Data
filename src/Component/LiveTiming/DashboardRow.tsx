import type { result_type } from "./Dashtypes"
import './Dashboard.css'

type Props = {
    result: result_type
}

// function formatLaptime(laptime: number | null) {
//     if (laptime === null) return "--:--.---";
//     const minutes = Math.floor(laptime / 60);
//     const seconds = Math.floor(laptime % 60);
//     const milliseconds = Math.round((laptime - Math.floor(laptime)) * 1000);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
// }

function DashboardRow({ result }: Props) {
    return <div className="dash-driver-row" key={result.driver.driverNumber}>
        <h3>{result.position}</h3>
        <h3 style={{color: `#${result.driver.driverTeamColor}`, fontFamily: 'F1'}}>{result.driver.driverAbbreviation}</h3>
        <h3>{result.tire.compound}</h3>
        <h3>L{result.tire.laps}</h3>
        <h3>{result.Gap.toFront}</h3>
        <h3>{result.Gap.toLeader}</h3>
        <h3>{result.lapTime.lastLap}</h3>
        <h3>{result.lapTime.bestLap}</h3>
        <h3>{result.sectors[0].sectorLast}</h3>
        <h3>{result.sectors[0].sectorBest}</h3>
    </div>
}

export default DashboardRow