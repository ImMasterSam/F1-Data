import type { tireInfo_type } from "../../Dashtypes";

type Props = {
    tire: tireInfo_type;
}

const tire_color: {[compound: string]: string} = {
  'SOFT': '#f12f32',
  'MEDIUM': '#fbcc1c',
  'HARD': '#ffffff',
  'INTERMEDIATE': '#228439',
  'WET': '#004cac',
  'UNKNOWN': '#555555'
}

const tire_name = (compound: string) => {
  switch (compound.toUpperCase()) {
    case 'INTERMEDIATE':
      return 'INTER'
    default:
      return compound.toUpperCase()
  }
}

function Tire({ tire }: Props) {
  return <div className="tire-feild">
    <h4 style={{color: tire_color[tire.compound]}}>{tire_name(tire.compound)}</h4>
    <p className="tire-laps">Lap {tire.laps}</p>
  </div>
}

export default Tire