import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { center } from "@turf/turf";
import { useQuery } from "react-query";

import "mapbox-gl/dist/mapbox-gl.css";

import hoods from "./data/hoods.json";
import rents from "./data/rents.json";
import kitas from "./data/kitas.json";

import { kitaLayer } from "./layers/kitaLayer";

const hoodsData = hoods;

const preferredDistricts = [
  "Kreuzberg",
  "Neukölln",
  "Alt-Treptow",
  "Tempelhof",
  "Plänterwald",
  "Baumschulenweg",
  "Schöneberg"
];

const getRentPrice = (f, rents) => {
  const { Name: n } = f.properties;
  const priceN = rents.filter(({ neighbourhood: n2 }) =>
    n ? n.includes(n2) : false
  )[0];
  if (priceN) {
    f.properties.price = priceN.price;
  }
  f.properties.name = f.properties.Name;
  delete f.properties.Name;
  delete f.properties.abbrev;
  return f;
};

hoodsData.features = hoodsData.features.map(f => getRentPrice(f, rents));

const hoodsLayer = (data, onActive) =>
  new GeoJsonLayer({
    id: "geojson",
    data: data,
    getFillColor: d => {
      if (d.properties.price) {
        return [255, 0, 0, d.properties.price * 5];
      }
      return [0, 0, 0, 50];
    },
    getStrokeColor: [0, 0, 0, 128],
    getLineWidth: d =>
      preferredDistricts.includes(d.properties.name) ? 30 : 10,
    pickable: true,
    onHover: d => (d.object ? onActive(d) : null)
  });

// const kitaData = {
//   type: "FeatureCollection",
//   features: kitas
//     .filter(({ district }) => preferredDistricts.includes(district))
//     .map(kita => ({
//       type: "Feature",
//       properties: {
//         ...kita,
//         maplink: `https://google.com/maps/search/${kita.address} Berlin`
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [kita.alon, kita.alat]
//       }
//     }))
// };

//const area2radius = area => area / (2 * Math.PI);

// const kitaLayer = (data, onActive) =>
//   new GeoJsonLayer({
//     id: "geojson2",
//     data: data,
//     radius: 10,
//     getFillColor: [0, 0, 0, 200],
//     pickable: true,
//     stroked: false,
//     pointRadiusMinPixels: 2,
//     getRadius: d => {
//       return area2radius(d.properties.over * 2);
//     },
//     onClick: d => (d.object ? onActive(d) : null)
//   });

const Map = () => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 52.48,
    longitude: 13.4,
    zoom: 11.5
  });

  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeKita, setActiveKita] = useState(null);
  const [activeKitaData, setActiveKitaData] = useState(null);

  useEffect(() => {
    if (activeKita && activeKita.id) {
      fetch(
        `https://sofetch.glitch.me/${encodeURI(
          "http://www.kita-suche.berlin/data/individual/2018_kitas.json"
        )}`
      )
        .then(res => res.json())
        .then(res => setActiveKitaData(res));
    }
  }, [activeKita]);
  return (
    <>
      <DeckGL
        viewState={viewport}
        controller
        onViewStateChange={({ viewState }) => setViewport(viewState)}
        layers={[
          hoodsLayer(hoodsData, d =>
            setActiveDistrict(
              `${d.object.properties.name} / ${d.object.properties.price} € per m²`
            )
          ),
          kitaLayer(
            kitas.filter(({ district }) =>
              preferredDistricts.includes(district)
            ),
            d => setActiveKita(d.object.properties)
          )
        ]}
      >
        <StaticMap
          reuseMaps
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxApiAccessToken="pk.eyJ1Ijoia3Jpc3RqYW5qYW5zZW4iLCJhIjoiY2pmaTcwMHdnMDhkbDJxcXZ0cmtpcmVuaCJ9.zOjSTb9ClEMeLPxGuA9t7g"
        />
      </DeckGL>
      {activeDistrict && (
        <div
          style={{
            position: "fixed",
            fontFamily: "sans-serif",
            padding: "10px",
            top: "10px",
            right: "10px",
            width: "350px",
            background: "rgba(255,255,255,0.75)"
          }}
        >
          {activeDistrict}
        </div>
      )}
      {activeKita && (
        <div
          style={{
            position: "fixed",
            fontFamily: "sans-serif",
            padding: "10px",
            top: "10px",
            left: "10px",
            width: "350px",
            background: "rgba(255,255,255,0.75)"
          }}
        >
          <div style={{ fontWeight: "bold" }}>{activeKita.name}</div>
          <br />
          <div>
            Address: {activeKita.address}
            <br />
            over 3 yo places: {activeKita.over}
            <br />
            <a href={activeKita.maplink} target="_blank">
              See on map
            </a>
            <br />
            <br />
            <a
              href={`https://www.berlin.de/sen/jugend/familie-und-kinder/kindertagesbetreuung/kitas/verzeichnis/KitaDetailsNeu.aspx?ID=${activeKita.id}`}
            >
              City kindergarten directory link
            </a>
            <br />
            <br />
            {activeKitaData && (
              <div>
                Web:
                <a href={activeKitaData.webLink}>{activeKitaData.webLink}</a>
                <br />
                E-mail: {activeKitaData.email}
                <br />
                <br />
                Educational: {activeKitaData.educational}
                <br />
                Topics: {activeKitaData.topics}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Map;
