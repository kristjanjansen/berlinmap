import { GeoJsonLayer } from "@deck.gl/layers";
import { scaleLinear, extent } from "d3";

const districtData = (data, rentData) => {
  return {
    type: "FeatureCollection",
    features: data.features.map(f => {
      const rent = rentData.filter(({ neighbourhood }) =>
        f.properties.Name ? f.properties.Name.includes(neighbourhood) : false
      )[0];
      return {
        type: "Feature",
        geometry: f.geometry,
        properties: {
          name: f.properties.Name,
          price: rent ? rent.price : null
        }
      };
    })
  };
};

export const districtLayer = (
  data,
  rentData,
  preferredDistricts,
  onActive,
  isDetailed
) => {
  const scale = scaleLinear()
    .domain(extent(rentData.map(d => d.price)))
    .range([25, 128]);

  return new GeoJsonLayer({
    id: "geojson",
    data: districtData(data, rentData),
    getFillColor: d => {
      if (isDetailed) {
        return [0, 0, 0, 0];
      }
      if (d.properties.price) {
        return [255, 103, 0, scale(d.properties.price)];
      }
      return [0, 0, 0, 50];
    },
    getLineColor: [0, 0, 0, 128],
    getLineWidth: d =>
      preferredDistricts.includes(d.properties.name) ? 30 : 10,
    pickable: true,
    onHover: d => (d.object ? onActive(d) : null)
  });
};
