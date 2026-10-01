import type { Layer } from 'leaflet';

declare module 'leaflet' {
  export function heatLayer(points: number[][], options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
  }): Layer;
}
