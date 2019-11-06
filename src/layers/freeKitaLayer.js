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
    getRadius: d => 200,
    getFillColor: [255, 0, 0, 128],
    pointRadiusMinPixels: 2
  });
};
