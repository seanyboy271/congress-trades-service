import express from "express";
import AdmZip from 'adm-zip';
import Axios from "axios"
import fs from 'fs'
import xml2js from 'xml2js';
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( _req: any, res: { send: (arg0: string) => void; } ) => {
    res.send( "Hello world!" );
} );

app.get("/get_house_data", async (req, res) => {
    const url ='https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'
    const result = await downloadAndExtract(url, Section.HOUSE)
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

const downloadAndExtract = async (url:string,section:Section) => {
    const response = await Axios.get(url, {responseType:'arraybuffer'});
    const dataDir = `${__dirname}/../data/${section}/${section}.json`;
    fs.writeFileSync(dataDir, response.data);
    return fs.readFileSync(dataDir, {encoding:'utf-8'});
}

enum Section{
    HOUSE = "house",
    SENATE = "senate"
}