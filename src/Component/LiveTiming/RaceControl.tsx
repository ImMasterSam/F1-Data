import type { raceControlMessages_type } from "../../Type/Dashtypes"

type Props = {
  raceControlMessages: raceControlMessages_type[];
}

type BoxProps = {
  mes: raceControlMessages_type;
}

const get_bgColor = (mes: raceControlMessages_type) => {
  if (mes.Flag) {
    const flag = mes.Flag.toLowerCase()
    if (flag === 'green' || flag === 'clear')
      return '#194019'
    else if (flag === 'yellow' || flag === 'doueble yellow')
      return '#404019'
    else if (flag === 'blue')
      return '#191940'
    else if (flag === 'red')
      return '#601919'
    else 
      return '#191919'
  }
  else
    return '#191919'
}

function MessageBox({ mes }: BoxProps) {
  return <div className="message-box" style={{backgroundColor: get_bgColor(mes)}}>
    <p className="time">{`${mes.Lap ? `Lap - ${mes.Lap} ` : ''}${new Date(mes.Utc+'Z').toLocaleString()}`}</p>
    <p className="message">{mes.Message}</p>
  </div>
}

function RaceControl({ raceControlMessages }: Props) {
  return <div className="race-control">
    <h3>Race Control</h3>
    <div className="race-control-messages">
      {raceControlMessages.map((mes, index) => {
        return <MessageBox mes={mes} key={index}/>
      })}
    </div>
  </div>
}

export default RaceControl