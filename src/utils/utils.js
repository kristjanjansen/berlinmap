import { load } from "cheerio";

export const area2radius = area => area / (2 * Math.PI);

export const parseSheet = data => {
  return data.feed.entry.map(entry => {
    return Object.keys(entry)
      .map(field => {
        if (field.startsWith("gsx$")) {
          return [field.split("$")[1], entry[field].$t];
        }
      })
      .filter(field => field)
      .reduce((field, item) => {
        field[item[0]] = item[1];
        return field;
      }, {});
  });
};

export const getTrackedKitas = () => {
  const id = "1x5G-IeHEj2EA8ILBRi6vyzyag5N4wL8ShBpJkKkwsvc";
  return fetch(
    `https://spreadsheets.google.com/feeds/list/${id}/od6/public/values?alt=json`
  )
    .then(res => res.json())
    .then(res => parseSheet(res));
};

export const getFlats = () => {
  const id = "1Qaiu6UQ0diP1olV1VYfMP1XY4ZNyQpMxqHiIKLNHaHU";
  return fetch(
    `https://spreadsheets.google.com/feeds/list/${id}/od6/public/values?alt=json`
  )
    .then(res => res.json())
    .then(res => parseSheet(res));
};

export const getFreeKitas = () =>
  fetch(
    `https://sofetch.glitch.me/${encodeURI(
      "https://www.berlin.de/sen/jugend/familie-und-kinder/kindertagesbetreuung/kitas/verzeichnis/FreiePlaetze.aspx"
    )}`
  )
    .then(r => r.text())
    .then(r => {
      const $ = load(r);
      const ids = [];

      $("#DataListFreiePlaetze a").each((i, el) => {
        ids.push(
          parseInt(
            $(el)
              .attr("href")
              .split("=")[1]
              .trim()
          )
        );
      });

      return ids;
    });

export const getMetro = () => {
  return fetch(`/data/metro.json`).then(res => res.json());
};
