import express from "express";
import Axios from "axios";
import fs from 'fs';
import { Section } from "./models/sections";
import { HouseData, SenateData, SenateEntry } from "./models/data";
import cors from 'cors'
const app = express();
const port = 8080;

app.use(cors({origin: 'http://localhost:3000'}))

app.get("/get_house_data", async (req, res) => {
    const url ='https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'
    const result:HouseData = await downloadAndExtract(url, Section.HOUSE);
    res.send(result);
})

app.get("/get_senate_data", async (req, res) => {
    const url ='https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.json'
    const result:SenateData = await downloadAndExtract(url, Section.SENATE);
    res.send(result);
})

app.listen( port, () => {
    console.log(`server started at http://localhost:${ port }`);
});

const downloadAndExtract = async (url:string,section:Section): Promise<any> => {
    const response = await Axios.get(url, {responseType:'arraybuffer'});
    const dataDir = `${__dirname}/../data/${section}/${section}.json`;
    fs.writeFileSync(dataDir, response.data);
    return {entries:JSON.parse(fs.readFileSync(dataDir, { encoding: 'utf-8' }))};
}
