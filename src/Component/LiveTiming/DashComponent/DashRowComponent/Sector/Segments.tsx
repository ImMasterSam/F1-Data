type Props = {
    segments: number[];
}

const segment_color: {[status: number]: string} = {
     0: '#222222',
  2051: '#7a22fe',
  2049: '#01a656',
  2048: '#ffb900',
  2064: '#2b7fff'
}

function Segment({ segments }: Props) {
  return <div className="segment-row">
    {segments.map((status, index) => {
        return <div className="segment" style={{backgroundColor: `${segment_color[status]}`}} key={index}></div>
    })}
  </div>
}

export default Segment