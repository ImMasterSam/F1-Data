import type { clock_type } from "../../../Type/Dashtypes"

type Props = {
  clock: clock_type
}


import { useEffect, useRef, useState } from "react"

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function CountDown({ clock }: Props) {
  
  const [seconds, setSeconds] = useState<number>(clock.remaining)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {

    setSeconds(clock.remaining)
    if (!clock.extrapolating || clock.remaining <= 0) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (!clock.extrapolating || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }

  }, [clock.remaining, clock.extrapolating])

  return <h3>{formatTime(seconds)}</h3>
}

export default CountDown