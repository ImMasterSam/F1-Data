import { RechartsDevtools } from "@recharts/devtools";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPointsEvolution } from "../../../Lib/standingData";
import type { DriversPointsEvolution, driverStanding_type } from "../../../Type/StandingTypes";
import { team_theme } from "../../../Lib/TeamTheme";
import type { race_type } from "../../../Type/RaceTypes";

type Props = {
  year: number;
  schedule: race_type[]
  driverStanding: driverStanding_type[];
}

type PointsCustomTooltipProps = {
  active?: boolean;
  payload?: readonly any[];
  label?: string | number;
  schedule: race_type[];
};

function PointsEvolutionTooltip({ active, payload, label, schedule }: PointsCustomTooltipProps) {
  if (active && payload && payload.length) {
    
    // Grand Prix Name
    const currentRace = schedule.find(race => parseInt(String(race.round)) === parseInt(String(label) || '0'));
    const raceName = currentRace ? currentRace.raceName : `Round ${label}`;

    // Sort Data
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div className="custom-tooltip">
        {/* 標題與分站名稱 */}
        <div className="tooltip-header">
          <p className="tooltip-race-name">{raceName}</p>
          <p className="tooltip-round-info">Round {label}</p>
        </div>

        {/* 列表內容 */}
        <div className="tooltip-list">
          {sortedPayload.map((entry: any) => (
            <div key={entry.name} className="tooltip-item">
              <div className="tooltip-driver-info">
                {/* 顏色圓點 */}
                <span 
                  className="tooltip-color-dot" 
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="tooltip-driver-name">{entry.name}</span>
              </div>
              <span className="tooltip-points">{entry.value} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function PointsEvolution({year, schedule, driverStanding}: Props) {

  const [evolutionData, setEvolutionData] = useState<DriversPointsEvolution[]>([]);
  const [driverKeys, setDriverKeys] = useState<string[]>([])

  useEffect(() => {
    getPointsEvolution(year).then((data) => {
      setEvolutionData(data);
      console.log(data);

      if (data.length > 0){
        const keys = Object.keys(data[data.length-1])
        console.log('Driver Keys:', keys);
        const drivers = keys.filter((key) => {return key !== 'round'})
        console.log('Driver Keys:', drivers);
        setDriverKeys(drivers)
      }

    })
  }, [year])
  
    return (
      <div className="standing-chart-container">
        <RechartsDevtools />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={evolutionData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
            {/* 格線淺一點：設定 stroke 為深灰色並降低透明度 */}
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.9} />
            
            <XAxis 
              dataKey="round"
              label={{ value: 'Round', position: 'insideBottom', offset: -10, fill: '#fff' }}
              stroke="white"
            />
            <YAxis
              domain={[0, 'max']} 
              label={{ value: 'Points', angle: -90, position: 'insideLeft', fill: '#fff' }}
              stroke="white"
            />
            <Tooltip 
              content={(props) => <PointsEvolutionTooltip {...props} schedule={schedule} />} 
              cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: "4 4" }}
              wrapperStyle={{ zIndex: 1000 }} 
            />
            {driverKeys.map((key) => {
              const driver = driverStanding.find((driverData) => {
                return driverData.Driver.code == key;
              })
              if (!driver) return null;

              const teamColor = team_theme[driver.Constructors?.[driver.Constructors.length-1].constructorId];

              return (
                <Line 
                  type="monotone" 
                  key={key} 
                  dataKey={key} 
                  stroke={teamColor}
                  strokeWidth={3} /* 線再粗一點 */
                  dot={{ r: 3, strokeWidth: 0, fill: teamColor }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              )
            })}
            
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}

export default PointsEvolution