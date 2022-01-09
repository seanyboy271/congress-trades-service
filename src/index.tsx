import express from "express";
import Axios from "axios";
import fs from "fs";
import { Section } from "./models/sections";
import { CongressData, HouseEntry, SenateEntry } from "./models/data";
import cors from "cors";
import path from "path";
import { elementAt } from "rxjs";
const app = express();
const port = 8080;

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/get_house_data", async (req, res) => {
  const url =
    "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json";
  const result: HouseEntry[] = (await downloadAndExtract(
    url,
    Section.HOUSE
  )) as HouseEntry[];
  res.send(result);
});

app.get("/get_senate_data", async (req, res) => {
  const url =
    "https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.json";
  const result: SenateEntry[] = (await downloadAndExtract(
    url,
    Section.SENATE
  )) as SenateEntry[];
  res.send(result);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

const downloadAndExtract = async (
  url: string,
  section: Section
): Promise<Array<CongressData>> => {
  const today = new Date();
  const dataDir_today = `${__dirname}/../data/${section}/${section}_${today.getFullYear()}-${today.getMonth()}-${today.getDay()}.json`;

  //   Only download new data if the file that already exists is not from today
  if (!fs.existsSync(dataDir_today)) {
    clearDirectory(`${__dirname}/../data/${section}`);
    const response = await Axios.get(url, { responseType: "arraybuffer" });
    fs.writeFile(dataDir_today, response.data, () => {});
    const res: CongressData[] = JSON.parse(
      fs.readFileSync(dataDir_today, { encoding: "utf-8" })
    );
    return res.map((elem) => {
      const split = elem.transaction_date.split("-");
      return {
        ...elem,
        transaction_date: `${split[1]}/${split[2]}/${split[0]}`,
      };
    });
  } else {
    const response: CongressData[] = JSON.parse(
      fs.readFileSync(dataDir_today, { encoding: "utf-8" })
    );
    return response.map((elem) => {
      const split = elem.transaction_date.split("-");
      return {
        ...elem,
        transaction_date: `${split[1]}/${split[2]}/${split[0]}`,
      };
    });
  }
};

const clearDirectory = (directory: string) => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};
