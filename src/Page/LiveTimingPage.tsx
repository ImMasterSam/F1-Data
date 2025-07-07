import { useEffect, useRef, useState } from "react"
import Dashboard from "../Component/LiveTiming/Dashboard"
import type { dashData_type } from "../Type/Dashtypes"
import "../CSS/Page.css";

function LiveTimingPage() {

  const [data, setData] = useState<dashData_type | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connectStream = () => {

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const url = 'http://127.0.0.1:5000/stream/live'
    // const url = 'https://f1data.duckdns.org/stream/live'
    let eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (mes) => {
      //console.log(JSON.parse(mes.data).results[0]);
      const content = JSON.parse(mes.data)
      console.log(content);
      setData(content)
    }

    eventSource.onopen = () => {
      setIsConnected(true)
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setIsConnected(false);
      if (!retryTimeoutRef.current) {
        retryTimeoutRef.current = setTimeout(() => {
          connectStream()
        }, 2000)
      }
    };

    return () => {
      setIsConnected(false)
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
    {data ? <Dashboard data={data} connectStatus={isConnected} /> : <h2>Connecting to Server ...</h2>}
  </div>
}

export default LiveTimingPage