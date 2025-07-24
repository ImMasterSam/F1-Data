import type { circuit_type, corner_type } from "../../Type/Dashtypes"

type Map_Props = {
  circuit: circuit_type;
}

type Graph_Props = {
  corners: corner_type[];
  trackPath: [number, number][];
  rotation: number;
}

function Graph({ corners, trackPath, rotation }: Graph_Props) {

  // Rotate The Graph First
  const xs = trackPath.map(p => p[0])
  const ys = trackPath.map(p => p[1])
  const px = (Math.max(...xs) - Math.min(...xs)) / 2
  const py = (Math.max(...ys) -  Math.min(...ys)) / 2

  const rad = (deg: number) => deg * (Math.PI / 180);
  const rotate = (x: number, y: number, a: number, px: number, py: number): [number, number] => {
    const c = Math.cos(rad(a));
    const s = Math.sin(rad(a));

    x -= px;
    y -= py;

    const newX = x * c - y * s;
    const newY = y * c + x * s;

    return [newX + px, (newY + py) * -1];
  }

  const rotated_path = trackPath.map(c => rotate(c[0], c[1], rotation, px, py))

  // get minimun for resizing
  const rxs = rotated_path.map(p => p[0])
  const rys = rotated_path.map(p => p[1])
  const maxX = Math.max(...rxs), minX = Math.min(...rxs)
  const maxY = Math.max(...rys), minY = Math.min(...rys)
  const padding = 30

  const norm = (x: number, y: number): [number, number] => {
    const originalWidth = maxX - minX;
    const originalHeight = maxY - minY;
    const targetWidth = 800 - 2 * padding;
    const targetHeight = 400 - 2 * padding;

    const scale = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);

    const offsetX = (targetWidth - originalWidth * scale) / 2;
    const offsetY = (targetHeight - originalHeight * scale) / 2;

    return [
      padding + offsetX + (x - minX) * scale,
      padding + offsetY + (y - minY) * scale
    ];
  }

  const norm_path = [...rotated_path, rotated_path[0]].map(c => norm(c[0], c[1]))
  const points = `M${norm_path[0][0]},${norm_path[0][1]} ${norm_path.map(([x, y]) => `L${x},${y}`).join(" ")}`

  const shiftLen = 20
  const shiftPoints = (x: number, y: number, a: number, dis: number): [number, number] => {
    const c = Math.cos(rad(a + 90));
    const s = Math.sin(rad(a + 90));
    
    const newX = x + c * dis;
    const newY = y - s * dis;

    return [newX, newY]
  }

  return <svg width={800} height={400} >
    <path
      d={points}
      fill="none"
      stroke="#222"
      strokeLinejoin="round"
      strokeWidth={20}
    />
    <path
      d={points}
      fill="none"
      stroke="#AAA"
      strokeLinejoin="round"
      strokeWidth={5}
    />
    {corners.map((c, i) => {
      const [rx, ry] = rotate(c.x, c.y, rotation, px, py)
      const [nx, ny] = norm(rx, ry)
      const [cx, cy] = shiftPoints(nx, ny, c.angle, shiftLen)
      return (
        <g key={i}>
          <circle cx={cx} cy={cy} r={6} />
          <text x={cx} y={cy} textAnchor="middle" fontSize="10" fill="#555">{c.number}</text>
        </g>
      );
    })}
  </svg>
  
}

function Map({ circuit }: Map_Props) {
  return <div className="map">
    <h2>{circuit.trackName}</h2>
    <Graph corners={circuit.corners} trackPath={circuit.trackPath} rotation={circuit.rotation}/>
  </div>
}

export default Map