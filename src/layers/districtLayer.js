import { GeoJsonLayer } from "@deck.gl/layers";

// const getRentPrice = (f, rentData) => {
//   const { Name: n } = f.properties;
//   const priceN = rentData.filter(({ neighbourhood: n2 }) =>
//     n ? n.includes(n2) : false
//   )[0];
//   if (priceN) {
//     f.properties.price = priceN.price;
//   }
//   f.properties.name = f.properties.Name;
//   delete f.properties.Name;
//   delete f.properties.abbrev;
//   return f;
// };

// const getRentPrice2 = (f, rentData) => {
//   const { Name: n } = f.properties;
//   const priceN = rentData.filter(({ neighbourhood: n2 }) =>
//     n ? n.includes(n2) : false
//   )[0];
//   if (priceN) {
//     f.properties.price = priceN.price;
//   }
//   f.properties.name = f.properties.Name;
//   delete f.properties.Name;
//   delete f.properties.abbrev;
//   return f;
// };

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

export const districtLayer = (data, rentData, preferredDistricts, onActive) =>
  new GeoJsonLayer({
    id: "geojson",
    data: districtData(data, rentData),
    getFillColor: d => {
      if (d.properties.price) {
        return [255, 103, 0, d.properties.price * 7];
      }
      return [255, 255, 255, 128];
    },
    getStrokeColor: [0, 0, 0, 128],
    getLineWidth: d =>
      preferredDistricts.includes(d.properties.name) ? 30 : 10,
    pickable: true,
    onHover: d => (d.object ? onActive(d) : null)
  });
