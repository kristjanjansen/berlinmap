import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
//import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
//import { center } from "@turf/turf";
//import { useQuery } from "react-query";

import "mapbox-gl/dist/mapbox-gl.css";

import districts from "./data/districts.json";
import rents from "./data/rents.json";
import kitas from "./data/kitas.json";

import { getFreeKitas } from "./utils/utils";

import { kitaLayer, kitaLayer2 } from "./layers/kitaLayer";
import { districtLayer } from "./layers/districtLayer";

const preferredDistricts = [
  "Kreuzberg",
  "Neukölln",
  "Alt-Treptow",
  "Tempelhof",
  "Plänterwald",
  "Baumschulenweg",
  "Schöneberg",
  "Moabit"
];

const cleanRent = rent => {
  const fixName = {
    Weissensee: "Weißensee",
    Middle: "Mitte",
    Moabite: "Moabit",
    "Hansa district": "Hansaviertel"
  };
  if (fixName[rent.neighbourhood]) {
    rent.neighbourhood = fixName[rent.neighbourhood];
  }
  return rent;
};

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

  const [freeKitas, setFreeKitas] = useState([]);

  useEffect(() => {
    const getKitas = async () => {
      const kitas = await getFreeKitas();
      setFreeKitas(kitas);
    };
    getKitas();
  }, []);

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
          districtLayer(
            districts,
            rents.map(cleanRent),
            preferredDistricts,
            d => setActiveDistrict(d.object.properties)
          ),
          kitaLayer(
            kitas.filter(({ district }) =>
              preferredDistricts.includes(district)
            ),
            d => setActiveKita(d.object.properties)
          ),
          kitaLayer2(kitas.filter(({ id }) => freeKitas.includes(id)))
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
          {JSON.stringify(freeKitas)}
          {activeDistrict.name} {activeDistrict.price || "?"} € per m²
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
              target="_blank"
            >
              City kindergarten directory link
            </a>
            <br />
            <br />
            {activeKitaData && (
              <div>
                Web:
                <a target="_blank" href={activeKitaData.webLink}>
                  {activeKitaData.webLink}
                </a>
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
