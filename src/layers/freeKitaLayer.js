import { GeoJsonLayer } from "@deck.gl/layers";

const freeKitaData = data => ({
  type: "FeatureCollection",
  features: data.map(kita => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [kita.alon, kita.alat]
    }
  }))
});

export const freeKitaLayer = data => {
  return new GeoJsonLayer({
    id: "kitaLayer2",
    data: freeKitaData(data),
    getRadius: d => 250,
    getFillColor: [255, 255, 0, 180],
    pointRadiusMinPixels: 2
  });
};
