const express = require("express");
const req = require("express/lib/request");
const { google } = require("googleapis");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client,
    });

    const spreadsheetId = "1QK5wI6VMuIOPFO4SBXLduEOhglRig6isKutXdET-Ieo";

    return {
        auth,
        client,
        googleSheets,
        spreadsheetId,
    };
}


app.get("/", async (req, res)=> {
    res.send("Ok")
})

app.get("/metadata", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    res.send(metadata.data);
});

app.get("/get-rows", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Form Responses 1",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING",
    });

    res.send(getRows.data.values);
});


app.listen(port, () => console.log("Running in 3001"));