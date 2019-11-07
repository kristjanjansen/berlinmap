import { GeoJsonLayer } from "@deck.gl/layers";

export const wallLayer = data => {
  return new GeoJsonLayer({
    id: "wallLayer",
    data: data,
    stroked: true,
    getFillColor: d => [0, 0, 0, 0],
    getLineColor: d => [255, 0, 0, 60],
    lineWidthMinPixels: 5,
    getLineWidth: d => 50
  });
};
