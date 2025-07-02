import type { trackStatus_type } from "../Dashtypes";

type Props = {
    trackStatus: trackStatus_type;
}

const getMessage = (status: number): string => {
  switch (status) {
    case 1:
      return 'Track Clear'
    case 2:
      return 'Yellow Flag'
    case 3:
      return 'Never Seen'
    case 4:
      return 'SC'
    case 5:
      return 'Red Flag'
    case 6:
      return 'VSC'
    case 7:
      return 'VSC Ending'
    default:
      return 'Unknown'
  }
}

const getColor = (status: number): string => {
  switch (status) {
    case 1:
      return '#01a656'
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
      return '#ffb900'
    case 5:
      return '#aa0000'
    default:
      return '#333333'
  }
}

function TrackStatus({ trackStatus }: Props) {
  return <div className="track-status" style={{backgroundColor: `${getColor(trackStatus.status)}`}}>
    <h3>{getMessage(trackStatus.status)}</h3>
  </div>
}

export default TrackStatus