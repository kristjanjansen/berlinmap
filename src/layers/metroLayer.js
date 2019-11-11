import { GeoJsonLayer } from "@deck.gl/layers";

const uData = data => ({
  type: "FeatureCollection",
  features: data
    .filter(m => String(m.properties.ref).startsWith("U"))
    .map(m => ({
      type: "Feature",
      geometry: m.geometry,
      properties: m.properties
    }))
});

const sData = data => ({
  type: "FeatureCollection",
  features: data
    .filter(m => String(m.properties.ref).startsWith("S"))
    .map(m => ({
      type: "Feature",
      geometry: m.geometry
    }))
});

export const metroLayer = data => {
  return [
    new GeoJsonLayer({
      id: "s",
      data: sData(data),
      getLineColor: d => [50, 100, 50, 100],
      getFillColor: d => [0, 0, 0, 0],
      lineWidthMinPixels: 3,
      getLineWidth: d => 20,
      pickable: true
    }),
    new GeoJsonLayer({
      id: "u",
      data: uData(data),
      stroked: true,
      getFillColor: d => [0, 0, 0, 0],
      getLineColor: d => [100, 100, 255, 100],
      lineWidthMinPixels: 3,
      getLineWidth: d => 20,
      pickable: true
    })
  ];
};
