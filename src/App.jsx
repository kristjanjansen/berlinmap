import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
//import { GeoJsonLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
//import { center } from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";
import "./fonts/manrope.css";
import "./App.css";

import districts from "./data/districts.json";
import rents from "./data/rents.json";
import kitas from "./data/kitas.json";

import { getFreeKitas, getTrackedKitas } from "./utils/utils";

import { kitaLayer } from "./layers/kitaLayer";
import { freeKitaLayer } from "./layers/freeKitaLayer";
import { districtLayer } from "./layers/districtLayer";
import { trackedKitaLayer } from "./layers/trackedKitaLayer";

const preferredDistricts = [
  "Kreuzberg",
  "Neukölln",
  "Alt-Treptow",
  "Tempelhof",
  "Plänterwald",
  "Baumschulenweg",
  "Schöneberg",
  "Britz",
  "Lichtenberg",
  "Friedrichshain",
  "Rummelsburg",
  "Karlshorst",
  "Moabit",
  "Wilmersdorf"
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

  const [trackedKitas, setTrackedKitas] = useState([]);

  useEffect(() => {
    const getKitas = async () => {
      const kitas = await getTrackedKitas();
      setTrackedKitas(kitas);
    };
    getKitas();
  }, []);

  useEffect(() => {
    if (activeKita && activeKita.id) {
      fetch(
        `https://sofetch.glitch.me/${encodeURI(
          `http://www.kita-suche.berlin/data/individual/${activeKita.id}_kitas.json`
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
        getCursor={d => "crosshair"}
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
          freeKitaLayer(kitas.filter(({ id }) => freeKitas.includes(id))),
          trackedKitaLayer(
            kitas.filter(({ id }) => {
              return trackedKitas.map(k => parseInt(k.id)).includes(id);
            }),
            trackedKitas
          )
        ]}
      >
        <StaticMap
          attributionControl={false}
          reuseMaps
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxApiAccessToken="pk.eyJ1Ijoia3Jpc3RqYW5qYW5zZW4iLCJhIjoiY2pmaTcwMHdnMDhkbDJxcXZ0cmtpcmVuaCJ9.zOjSTb9ClEMeLPxGuA9t7g"
        />
      </DeckGL>
      {activeDistrict && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            left: "30px",
            display: "inline"
          }}
        >
          <div
            style={{
              fontWeight: 900,
              fontSize: "70px",
              lineHeight: "0.9em",
              marginBottom: "15px"
            }}
          >
            {activeDistrict.name}
          </div>
          <p style={{ fontWeight: 900, fontSize: "30px" }}>
            €{activeDistrict.price || "?"} per m²
          </p>
        </div>
      )}
      {activeKita && (
        <div
          style={{
            borderLeft: "3px solid black",
            position: "fixed",
            padding: "20px",
            top: "0px",
            right: "0px",
            bottom: "0px",
            width: "350px",
            background: "rgba(255,255,255,0.8)"
          }}
        >
          <div
            style={{
              fontSize: "30px",
              lineHeight: "1.1em",
              fontWeight: 900
            }}
          >
            {activeKita.name}
          </div>
          <br />
          <div>
            <b>Address:</b> {activeKita.address}
            <br />
            <b>Places:</b> {activeKita.over} (over 3yo)
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
                <b>Web:</b>
                <a target="_blank" href={activeKitaData.webLink}>
                  {activeKitaData.webLink}
                </a>
                <br />
                <b>E-mail:</b> {activeKitaData.email}
                <br />
                <br />
                <b>Educational:</b> {activeKitaData.educational}
                <br />
                <b>Topics:</b> {activeKitaData.topics}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Map;
