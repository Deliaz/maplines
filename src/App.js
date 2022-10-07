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
  Circle,
} from 'react-leaflet'
import L from 'leaflet';
import {useState} from 'react';
import {AiFillGithub} from 'react-icons/ai';
import {AiFillTwitterCircle} from 'react-icons/ai';

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
        const rMeters = e.latlng.distanceTo(markerPosition)
        setDistance({
          formattedX: (e.latlng.distanceTo([e.latlng.lat, markerPosition.lng]) / 1e3).toFixed(2),
          formattedY: (e.latlng.distanceTo([markerPosition.lat, e.latlng.lng]) / 1e3).toFixed(2),
          formattedR: (rMeters / 1e3).toFixed(2),
          r: rMeters,
        });
      } else {
        setDistance(null);
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
          <>
            <Popup position={markerPosition}>
              X: {distance.formattedX} km <br />
              Y: {distance.formattedY} km <br />
              R: {distance.formattedR} km
            </Popup>
            <Circle center={markerPosition}
              radius={distance.r}
              weight={1}
              fill={false}
              color={LINE_COLOR} />
          </>
        )}
      </>
    )}
  </>
}

function Link({url, icon, children}) {
  const Icon = icon;
  return <a href={url} className="icon-link">
    <Icon size="24px" />
    <span>{children}</span>
  </a>
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
        <div className="social-links">
          <Link url="https://twitter.com/d3liaz" icon={AiFillTwitterCircle}>twitter.com/d3liaz</Link>
          <Link url="https://github.com/Deliaz/maplines" icon={AiFillGithub}>github</Link>
        </div>
      </header>
      <MapContainer center={[30, 0]} zoom={4} scrollWheelZoom={true}>
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
