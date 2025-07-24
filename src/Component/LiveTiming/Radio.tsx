import { useEffect, useRef, useState } from "react"
import { FaPlay,FaPause } from "react-icons/fa";
import type { teamRadio_type } from "../../Type/Dashtypes"

type Radio_Props = {
  teamRadio: teamRadio_type[]
  
}

type RadioPlayer_Props = {
  radio: teamRadio_type
}

function RadioPlayer({ radio }: RadioPlayer_Props) {

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [percent, setPercent] = useState<number>(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause()
    }
    else {
      handlePlay()
    }
  }

  const handlePlay = () => {
    audioRef.current?.play()
    setIsPlaying(true)
  }

  const handlePause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const handleReset = () => {
    handlePause()
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {

      if (audioRef.current.currentTime == audioRef.current.duration) {
        handleReset()
      }

      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
      const percent_value = ((audioRef.current.currentTime / audioRef.current.duration) || 0) * 100;
      setPercent(percent_value)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const targetTime = Number(e.target.value)
      audioRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    }

    return () => {
      if (audioRef.current){
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }

  }, [])

  return <div className="radio-player">
    <p className="time">{`${new Date(radio.Utc).toLocaleString()}`}</p>
    <div className="radio-player-body">
      <h4 style={{color: `#${radio.driver.driverTeamColor}`}}>{radio.driver.driverAbbreviation}</h4>
      <button onClick={handlePlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <input 
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        step="0.25"
        style={{
          background: `linear-gradient(to right, #${radio.driver.driverTeamColor} 0%, #${radio.driver.driverTeamColor} ${percent}%, #555 ${percent}%, #555 100%)`
        }}
      />
      <audio ref={audioRef} src={radio.Path}></audio>
    </div>

  </div>
}

function Radio({ teamRadio }: Radio_Props) {
  return <div className="radio-panel">
    <h3>Team Radio</h3>
    <div className="team-radio">
      {teamRadio.map((radio: teamRadio_type) => {
        return <RadioPlayer radio={radio} key={radio.Path}/>
      })}
    </div>
  </div>
}

export default Radio