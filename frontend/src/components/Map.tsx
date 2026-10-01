import { GeoJSON, MapContainer, Marker, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import L, { type LeafletEvent, type Map as LeafletMap } from 'leaflet';
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from 'geojson';
import { useEffect, useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useGlobalState } from '../context/state.tsx';

type NeighbourhoodProperties = { neighbourhood_group?: string };
type NeighbourhoodFeature = Feature<Geometry, NeighbourhoodProperties>;
type NeighbourhoodCollection = FeatureCollection<Geometry, NeighbourhoodProperties>;

interface GeoJsonState {
  inverseCity: GeoJsonObject | null;
  neighbourhood: NeighbourhoodCollection | null;
  selectedNeighbourhood: NeighbourhoodFeature[];
}

function HeatmapLayer({ heatmapData }: { heatmapData: number[][] }) {
  const map = useMap();
  useEffect(() => {
    const heatLayer = L.heatLayer(heatmapData, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [heatmapData, map]);
  return null;
}

function ResizeContainer({ width }: { width: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map, width]);
  return null;
}

function ZoomGrab({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  useMapEvent('zoomend', (event: LeafletEvent) => onZoomChange((event.target as LeafletMap).getZoom()));
  return null;
}

function Map({ width }: { width: boolean }) {
  const { filters, displayData } = useGlobalState();
  const [dotSize, setDotSize] = useState(10);
  const [geoJson, setGeoJson] = useState<GeoJsonState>({ inverseCity: null, neighbourhood: null, selectedNeighbourhood: [] });

  useEffect(() => {
    const loadCityBoundary = async () => {
      try {
        const response = await fetch('http://localhost:8000/geojson');
        const data: GeoJsonObject = await response.json();
        setGeoJson((current) => ({ ...current, inverseCity: data }));
      } catch (error) {
        console.error('Error fetching city boundary:', error);
      }
    };
    void loadCityBoundary();
  }, []);

  useEffect(() => {
    const loadNeighbourhoods = async () => {
      try {
        const response = await fetch('http://localhost:8000/geojsonNeighbourhood');
        const data: NeighbourhoodCollection = await response.json();
        setGeoJson((current) => ({ ...current, neighbourhood: data }));
      } catch (error) {
        console.error('Error fetching neighbourhood boundaries:', error);
      }
    };
    void loadNeighbourhoods();
  }, []);

  useEffect(() => {
    if (!geoJson.neighbourhood) return;
    const selectedNeighbourhood = geoJson.neighbourhood.features.filter(
      (feature) => feature.properties.neighbourhood_group === filters.location,
    );
    setGeoJson((current) => ({ ...current, selectedNeighbourhood }));
  }, [filters.location, geoJson.neighbourhood]);

  const heatmapData = useMemo(
    () => displayData
      .map(({ latitude, longitude }) => [Number(latitude), Number(longitude), 0.5])
      .filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude)),
    [displayData],
  );
  const dotIcon = useMemo(() => L.divIcon({ className: 'custom-dot', iconSize: [dotSize, dotSize], iconAnchor: [dotSize / 2, dotSize / 2] }), [dotSize]);
  const cityStyle = { fillColor: 'black', weight: 2, opacity: 1, fillOpacity: 0.3, color: 'transparent' };
  const neighbourhoodStyle = { ...cityStyle, fillColor: 'green' };

  return (
    <MapContainer center={[47.3769, 8.517]} zoom={14} style={{ height: '100%', width: '100%' }} className="container-fluid">
      <ZoomGrab onZoomChange={(zoom) => setDotSize(zoom <= 14 ? 6 : zoom <= 16 ? 10 : 15)} />
      <ResizeContainer width={width} />
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png" />
      {geoJson.inverseCity && <GeoJSON data={geoJson.inverseCity} style={cityStyle} />}
      {geoJson.selectedNeighbourhood.length > 0 && (
        <GeoJSON
          data={{ type: 'FeatureCollection', features: geoJson.selectedNeighbourhood } as unknown as GeoJsonObject}
          style={neighbourhoodStyle}
        />
      )}
      {filters.location === 'all' && <HeatmapLayer heatmapData={heatmapData} />}
      {filters.location !== 'all' && displayData.map((listing) => (
        <Marker key={listing.id} position={[Number(listing.latitude), Number(listing.longitude)]} icon={dotIcon}
          eventHandlers={{
            mouseover: (event) => (event.target as L.Marker).bindPopup(`<div>${listing.id}</div>`).openPopup(),
            mouseout: (event) => (event.target as L.Marker).closePopup(),
          }}
        />
      ))}
    </MapContainer>
  );
}

export default Map;
