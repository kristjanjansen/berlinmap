import { load } from "cheerio";

export const area2radius = area => area / (2 * Math.PI);

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
