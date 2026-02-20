type Props = {
    segments: number[];
}

const segment_color: {[status: number]: string} = {
     0: '#222222', // Not yet
  2051: '#7a22fe', // Overall Fastest
  2049: '#01a656', // Personal Fastest
  2048: '#ffb900', // Not Fastest
  2052: '#aa0000', // Stop
  2064: '#2b7fff', // In pit
}

function Segment({ segments }: Props) {
  return <div className="segment-row">
    {segments.map((status, index) => {
        return <div className="segment" style={{backgroundColor: `${segment_color[status]}`}} key={index}></div>
    })}
  </div>
}

export default Segment