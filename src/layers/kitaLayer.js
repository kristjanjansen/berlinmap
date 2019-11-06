import { GeoJsonLayer } from "@deck.gl/layers";

import { area2radius } from "../utils/utils";

const kitaData = data => ({
  type: "FeatureCollection",
  features: data
    //.filter(({ district }) => preferredDistricts.includes(district))
    .map(kita => ({
      type: "Feature",
      properties: {
        ...kita,
        maplink: `https://google.com/maps/search/${kita.address} Berlin`
      },
      geometry: {
        type: "Point",
        coordinates: [kita.alon, kita.alat]
      }
    }))
});

export const kitaLayer = (data, onActive) => {
  return new GeoJsonLayer({
    id: "kitaLayer",
    data: kitaData(data),
    radius: 10,
    getFillColor: [0, 0, 0, 200],
    pickable: true,
    stroked: false,
    pointRadiusMinPixels: 2,
    getRadius: d => area2radius(d.properties.over * 2),
    onHover: d => (d.object ? onActive(d) : null)
  });
};
