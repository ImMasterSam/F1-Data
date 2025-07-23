import { useEffect, useRef, useState } from "react"
import Dashboard from "../Component/LiveTiming/Dashboard"
import type { ConnectionState, dashData_type } from "../Type/Dashtypes"
import Map from "../Component/LiveTiming/Map";
import RaceControl from "../Component/LiveTiming/RaceControl";
import Radio from "../Component/LiveTiming/Radio";
import "../CSS/Page.css";
import '../CSS/Dashboard.css'
import '../CSS/DashInfo.css'


function LiveTimingPage() {

  const [data, setData] = useState<dashData_type | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    lastDataTime: 0,
    reconnectAttempts: 0,
    error: null
  })
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connectStream = async () => {

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const url = 'http://127.0.0.1:5000/stream/live'
    // const url = 'https://f1data.duckdns.org/stream/live'
    let eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnectionState((prev) => ({
        ...prev,
        isConnected: true,
        reconnectAttempts: 0,
        error: null
      }))

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }

    eventSource.onmessage = (mes) => {
      //console.log(JSON.parse(mes.data).results[0]);
      try {
        const content = JSON.parse(mes.data)
        console.log('[DEBUG] Data Received:', content)
        setData(content)
        
        setConnectionState(prev => ({
          ...prev,
          lastDataTime: Date.now(),
          error: null
        }))

        if (content.type === 'connected') {
          console.log('[INFO] Server Connected')
          return
        }
        else{
          setData(content)
        }
      }
      catch (error) {
        console.error('[ERROR] Error occurs when handling message:', error, mes.data)
      }

    }

    eventSource.onerror = (error) => {

      console.error('SSE error:', error);
      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        error: 'Connection error'
      }))

      if (!retryTimeoutRef.current) {
        retryTimeoutRef.current = setTimeout(() => {
          connectStream()
        }, 2000)
      }
    };

    return () => {
      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        error: 'Connection error'
      }))
      eventSource.close()
    }
  }

  useEffect(() => {
    console.log('trying to connect ... ');
    connectStream();
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close()
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
  }, [])

  return <div className="live-timing">
    {data?.grandPrixName 
    ? <div className="dash-container">
      <Dashboard data={data} connectionState={connectionState} />
      <div className="dash-info">
        <Map />
        <div className='message-info'>
          {data.raceControlMessages && <RaceControl raceControlMessages={data.raceControlMessages}/>}
          <Radio />
        </div>
      </div>
    </div>
    : <h2>Connecting to Server ...</h2>}
  </div>
}

export default LiveTimingPage