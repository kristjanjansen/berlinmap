import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleLinear, interpolateInferno, color } from "d3";

const airbnbData = data => ({
  type: "FeatureCollection",
  features: data.map(kita => ({
    type: "Feature",
    properties: { price: kita.price },
    geometry: {
      type: "Point",
      coordinates: [kita.longitude, kita.latitude]
    }
  }))
});

const colors = (a = 255) => [
  [127, 205, 187, a],
  [65, 182, 196, a],
  [44, 127, 184, a],
  [37, 52, 148, a]
];

const rgbColor = (value, a = 255) => {
  const { r, g, b } = color(interpolateInferno(value));
  return [r, g, b, a];
};

export const airbnbLayer = (data, isDetailed) => {
  const scale = scaleLinear()
    .domain([0, 200])
    .range([0.8, 0.5])
    .clamp(true);

  return new GeoJsonLayer({
    id: "airbnbLayer",
    data: airbnbData(data),
    getFillColor: d =>
      rgbColor(scale(d.properties.price), isDetailed ? 255 : 128),
    pointRadiusMinPixels: 1.25,
    getRadius: d => (isDetailed ? 8 : 4),
    stroked: false
  });
};
