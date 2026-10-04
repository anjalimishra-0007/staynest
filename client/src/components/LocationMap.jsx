import { useEffect, useState } from 'react';

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 13);
  }, [map, position]);

  return null;
}

export default function LocationMap({ address, city, state }) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = [address, city, state].filter(Boolean).join(', ');

    if (!query) {
      setError('Location information is not available.');
      return;
    }

    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to find this location.');
        }

        return response.json();
      })
      .then((results) => {
        if (!results.length) {
          setError('Could not find this location on the map.');
          return;
        }

        setPosition([Number(results[0].lat), Number(results[0].lon)]);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Could not load the map location.');
        }
      });

    return () => controller.abort();
  }, [address, city, state]);

  if (error) {
    return <p className="muted">{error}</p>;
  }

  if (!position) {
    return <p className="muted">Loading map...</p>;
  }

  return (
    <div className="location-map">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="location-map-container"
      >
        <MapCenter position={position} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={defaultIcon}>
          <Popup>
            {address}, {city}, {state}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
