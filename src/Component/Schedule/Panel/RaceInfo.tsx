import type { race_type } from "../../../Type/RaceTypes";

type Props = {
  race: race_type
}

const formatSessionTime = (dateStr: string, timeStr: string) => {
  if (!dateStr || !timeStr) return "TBA";
  
  // 組合 ISO 字串 (e.g., "2024-03-02T15:00:00Z")
  const dateTimeString = `${dateStr}T${timeStr}`;
  const date = new Date(dateTimeString);
  
  // 檢查日期是否有效
  if (isNaN(date.getTime())) return "TBA";

  // 格式化為: 02 Mar 15:00 (使用當地時間)
  // 如果沒有 date-fns，可以使用原生 Intl.DateTimeFormat
  return new Intl.DateTimeFormat('default', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

const SessionRow = ({ name, date, time }: { name: string, date?: string, time?: string }) => {
  if (!date || !time) return null;
  
  const dateTimeString = `${date}T${time}`;
  const sessionDate = new Date(dateTimeString);
  const isPast = sessionDate < new Date();

  return (
    <div className={`session-row ${isPast ? 'past' : 'upcoming'}`}>
      <span className="session-name">{name}</span>
      <span className="session-time">{formatSessionTime(date, time)}</span>
    </div>
  );
};

function RaceInfo({race}: Props) {
  return (
    <div className="schedule-raceinfo">
      {/* 標題與賽道資訊 */}
      <div className="info-header">
        <h2 className="race-round">ROUND {race.round}</h2> 
        <h1 className="race-title" onClick={
          () => {window.open(race.url, '_blank')}
        }>{race.raceName}</h1>
        <p className="location-name">
            {race.Circuit.circuitName}, {race.Circuit.Location.locality}, {race.Circuit.Location.country}
        </p>
      </div>

      <hr className="divider"/>

      {/* 賽程時間表 */}
      <div className="session-list">
        <h3 className="timetable-title">WEEKEND SCHEDULE (USER TIME)</h3>
        
        {/* F1 週末結構: FP1 -> FP2/SprintQuali -> FP3/Sprint -> Quali -> Race */}
        
        {/* Practice 1 Always exists */}
        <SessionRow name="Practice 1" date={race.FirstPractice?.date} time={race.FirstPractice?.time} />

        {/* Practice 2 or Sprint Qualifying */}
        <SessionRow name="Practice 2" date={race.SecondPractice?.date} time={race.SecondPractice?.time} />

        {/* Practice 3 (Standard Weekend) */}
        {race.ThirdPractice && (
          <SessionRow name="Practice 3" date={race.ThirdPractice.date} time={race.ThirdPractice.time} />
        )}

        {/* SprintQualifying (Sprint Weekend) */}
        <SessionRow name="Sprint Qualifying" date={race.SprintQualifying?.date} time={race.SprintQualifying?.time} />

        {/* Sprint (Sprint Weekend) */}
        {race.Sprint && (
          <SessionRow name="Sprint" date={race.Sprint.date} time={race.Sprint.time} />
        )}

        {/* Qualifying */}
        <SessionRow name="Qualifying" date={race.Qualifying?.date} time={race.Qualifying?.time} />

        {/* GRAND PRIX */}
        <SessionRow name="Grand Prix" date={race.date} time={race.time} />
      </div>
    </div>
  )
}

export default RaceInfo;