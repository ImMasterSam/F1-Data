type Wind_Props = {
  speed: number;
  direction:number
}

function Wind({ speed, direction }: Wind_Props) {
  return (
    <div className="wind">
      <h3>Wind</h3>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        style={{
          transform: `rotate(${direction}deg)`,
          transition: "transform 0.3s ease",
        }}
      >
        <path
          d="M12 2L15 8H9L12 2ZM12 22V8"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

        <p>{speed.toFixed(2)} km/h</p>
    </div>
  )
}

export default Wind