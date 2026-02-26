import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { race_type } from "../../../Type/RaceTypes";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css"; // 必須引入這行 CSS 才能正常顯示地圖


type Props = {
    race: race_type;
}

type Controller_Props = {
  center: [number, number]
}

function MapController({ center }: Controller_Props) {
  const map = useMap();
  
  useEffect(() => {
    const currentCenter = map.getCenter();
    const dist = currentCenter.distanceTo([center[0], center[1]])
    if (dist > 100) {
    map.flyTo(center, 14, {
      duration: 3,
    }); // 這裡可以設定縮放層級，例如 14 或 15
    console.log("Flying to:", center)
    }

  }, [center, map]); // 當 center 改變時觸發

  return null;
}

function TrackMap({race}: Props) {

  const position: [number, number] = [Number(race.Circuit.Location.lat), Number(race.Circuit.Location.long)]

  return (
    <MapContainer center={position} zoom={14} style={{ minHeight: "100%", minWidth: "50%", flex: 1}} className="track-map">
      
      {/* 底圖圖層 */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '5px 0' }}>{race.Circuit.circuitName}</h3>
            <p style={{ margin: 0 }}>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</p>
          </div>
        </Popup>
      </Marker>

      <MapController center={position}/>
    </MapContainer>
  );
}

export default TrackMap;