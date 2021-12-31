import express from "express";
import Axios from "axios";
import fs from "fs";
import { Section } from "./models/sections";
import { HouseEntry, SenateEntry } from "./models/data";
import cors from "cors";
const app = express();
const port = 8080;

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/get_house_data", async (req, res) => {
  const url =
    "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json";
  const result: HouseEntry[] = await downloadAndExtract(url, Section.HOUSE);
  res.send(result);
});

app.get("/get_senate_data", async (req, res) => {
  const url =
    "https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.json";
  const result: SenateEntry[] = await downloadAndExtract(url, Section.SENATE);
  res.send(result);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

const downloadAndExtract = async (
  url: string,
  section: Section
): Promise<any> => {
  const today = new Date();
  const dataDir_today = `${__dirname}/../data/${section}/${section}_${today.getFullYear()}-${today.getMonth()}-${today.getDay()}.json`;

  //   Only download new data if the file that already exists is not from today
  if (!fs.existsSync(dataDir_today)) {
    const response = await Axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(dataDir_today, response.data);

    //Delete old file
    today.setDate(today.getDate() - 1);
    const dataDir_yest = `${__dirname}/../data/${section}/${section}_${today.getFullYear()}-${today.getMonth()}-${today.getDay()}.json`;
    if (fs.existsSync(dataDir_yest)) {
      fs.unlink(dataDir_yest, () => {});
    }
  }
  return {
    entries: JSON.parse(fs.readFileSync(dataDir_today, { encoding: "utf-8" })),
  };
};
