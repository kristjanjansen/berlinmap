import { GeoJsonLayer } from "@deck.gl/layers";

const trackedKitaData = (data, trackedKitas) => ({
  type: "FeatureCollection",
  features: data.map(kita => ({
    type: "Feature",
    properties: {
      status: trackedKitas.filter(k => k.id == kita.id)[0].status
    },
    geometry: {
      type: "Point",
      coordinates: [kita.alon, kita.alat]
    }
  }))
});

export const trackedKitaLayer = (data, trackedKitas) => {
  const colors = [
    [80, 80, 80, 180],
    [255, 0, 0, 180],
    [0, 180, 120, 180],
    [200, 0, 200, 180]
  ];
  return new GeoJsonLayer({
    id: "trackedKitaLayer",
    data: trackedKitaData(data, trackedKitas),
    getRadius: d => 150,
    getFillColor: d => colors[d.properties.status],
    pointRadiusMinPixels: 2
  });
};
