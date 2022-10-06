import './App.css';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Popup,
} from 'react-leaflet'
import L from 'leaflet';
import {useState} from 'react';

const LINE_WIDTH = 2;
const LINE_COLOR = 'gray'

// https://stackoverflow.com/questions/49441600/react-leaflet-marker-files-not-found
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickMarker({position, onSet}) {
  useMapEvents({
    click(e) {
      onSet(position ? null : e.latlng)
    },
  });

  if (!position) {
    return null;
  }

  return <Marker position={position} icon={DefaultIcon} />
}

function Cross({markerPosition}) {
  const [hPosition, setHPosition] = useState(null);
  const [vPosition, setVPosition] = useState(null);
  const [distance, setDistance] = useState(null)

  useMapEvents({
    mousemove(e) {
      setVPosition(e.latlng.lat);
      setHPosition(e.latlng.lng);

      if (markerPosition) {
        setDistance({
          x: (e.latlng.distanceTo([e.latlng.lat, markerPosition.lng]) / 1e3).toFixed(2),
          y: (e.latlng.distanceTo([markerPosition.lat, e.latlng.lng]) / 1e3).toFixed(2),
          d: (e.latlng.distanceTo(markerPosition) / 1e3).toFixed(2),
        });
      }
    },
  });

  if (hPosition === null || vPosition === null) {
    return null;
  }

  return <>
    <Polyline pathOptions={{color: LINE_COLOR}}
      positions={[[-180, hPosition], [180, hPosition]]}
      weight={LINE_WIDTH} />
    <Polyline pathOptions={{color: LINE_COLOR}}
      positions={[[vPosition, -180], [vPosition, 180]]}
      weight={LINE_WIDTH} />
    {Boolean(markerPosition) && (
      <>
        <Polyline pathOptions={{color: LINE_COLOR}}
          positions={[[vPosition, hPosition], markerPosition]}
          weight={LINE_WIDTH} />
        <Polyline pathOptions={{color: LINE_COLOR}}
          positions={[markerPosition, [markerPosition.lat, hPosition]]}
          weight={LINE_WIDTH} />
        <Polyline pathOptions={{color: LINE_COLOR}}
          positions={[[vPosition, markerPosition.lng], markerPosition]}
          weight={LINE_WIDTH}>
        </Polyline>

        {Boolean(distance) && (
          <Popup position={markerPosition}>
            X: {distance.x} km <br />
            Y: {distance.y} km <br />
            D: {distance.d} km
          </Popup>
        )}
      </>
    )}
  </>
}

function App() {
  const [markerPosition, setMarkerPosition] = useState(null);
  return (
    <div className="App">
      <header>
        <div>
          <img src="/icon.png" alt="MapLines Logo" width={32} height={32} />
        </div>
        <div>
          <h1>MapLines: measure distance between two points</h1>
          <h2>Click on the map and move your mouse pointer around to see the distance from that
            point</h2>
        </div>
        <div className="social-link">
          <a href="https://twitter.com/d3liaz">twitter.com/d3liaz</a>
        </div>
      </header>
      <MapContainer center={[20, 0]} zoom={2.8} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <ClickMarker onSet={setMarkerPosition} position={markerPosition} />
        <Cross markerPosition={markerPosition} />
      </MapContainer>
    </div>
  );
}

export default App;
