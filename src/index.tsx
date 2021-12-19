import express from "express";
import Axios from "axios";
import { Section } from "./models/sections";
import { SenateData, SenateEntry } from "./models/data";
import fs from 'fs';
import { resourceLimits } from "worker_threads";
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( _req: any, res: { send: (arg0: string) => void; } ) => {
    res.send( "Hello world!" );
} );

app.get("/get_house_data", async (req, res) => {
    const url ='https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'
    const result = await downloadAndExtract(url, Section.HOUSE);
    res.send(result);
})

app.get("/get_senate_data", async (req, res) => {
    const url ='https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.json'
    const result = await downloadAndExtract(url, Section.SENATE);
    res.send(result);
})

// start the Express server
app.listen( port, () => {
    console.log(`server started at http://localhost:${ port }`);
});

const downloadAndExtract = async (url:string,section:Section): Promise<SenateData> => {
    const response = await Axios.get(url, {responseType:'arraybuffer'});
    const dataDir = `${__dirname}/../data/${section}/${section}.json`;
    fs.writeFileSync(dataDir, response.data);
    // console.log(typeof(JSON.parse(fs.readFileSync(dataDir, { encoding: 'utf-8' }))))
    return {entries:JSON.parse(fs.readFileSync(dataDir, { encoding: 'utf-8' })) as SenateEntry[]} as SenateData;
}
