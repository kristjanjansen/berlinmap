import { GeoJsonLayer } from "@deck.gl/layers";
import { circle } from "@turf/turf";

const flatsData = data => {
  return {
    type: "FeatureCollection",
    features: data.map(f =>
      circle([parseFloat(f.longitude), parseFloat(f.latitude)], 0.15, {
        steps: 4
      })
    )
  };
};

export const flatsLayer = data => {
  // const colors = [
  //   [80, 80, 80, 180],
  //   [255, 0, 0, 180],
  //   [0, 180, 120, 180],
  //   [200, 0, 200, 180]
  // ];
  return new GeoJsonLayer({
    id: "flatsLayer",
    data: flatsData(data),
    getRadius: d => 40,
    getFillColor: d => [0, 0, 0, 180],
    pointRadiusMinPixels: 4
  });
};
