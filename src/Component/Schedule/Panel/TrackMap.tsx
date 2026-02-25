import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { race_type } from "../../../Type/RaceTypes";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css"; // 1. 必須引入這行 CSS 才能正常顯示地圖

type Props = {
    race: race_type;
}

type Controller_Props = {
  center: [number, number]
}

function MapController({ center }: Controller_Props) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, 14, {
      duration: 3,
    }); // 這裡可以設定縮放層級，例如 14 或 15
    console.log(center)
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

      <MapController center={position}/>
    </MapContainer>
  );
}

export default TrackMap;