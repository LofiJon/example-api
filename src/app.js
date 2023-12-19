const express = require("express");
const req = require("express/lib/request");
const { google } = require("googleapis");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

async function getAuthSheets() {
    const credentialsGoogle = "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZmVzc29yYSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZiNzk5NmU5M2Q4OGIwYWY5ZjA1ZDBiMGRhYjFlZTNhNWY3NWExN2IiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQzlGeVJXTk5VaklvbEdcblA1TzQ2NE5rTVBadmxmMFlXTXZHK3BveTlRczl1RUdXOG9mbjUybkZzd3F4RmdmRzkxcHFIeDI5ME5GeVNIWStcblk2SzZVOVlWb0NYSkc2elNpMkpuTlI3QmlQY3Vjd1pDelJlVGg1cHArclVMUG1raVdTR0FqaXRBaHVxZEJKRkhcbkROejJtY1hyVG5sYTF1cGEwbGhjYk5VQ2gxdER2MzN0dEhFN1dlemNQd0VNL2RSZUpnKytrdDFsT2E1MVJKVG5cbnNnM3VBM2pjc2ZUMWxoaDlOcEVJV21PRTVjbW81ZFUrUm83MDhGNStjMmUzLy9SRWJSb1c2bXpqZG1FcjF5TDJcbmIzSnNQY25COXpPam56QTZ0aUpYdkNNOHlPc3NsYS9LM0NSQTZ1M3FPRjBrWWRRaCs5Z3hiWENiMnRrZVdrTktcblZHajNxS3Y1QWdNQkFBRUNnZ0VBQ1U0K2dFeVUwYWdWTStNVW1NVGtZRFdscHh1dFN6bXhlNThoSUJGZHBvR3ZcbkhxZmNadDRGWDFDZW5kVHMrSTU3UVY0N0p6aUQyamsxTW9CU1JaT3pKVGpPcXoxRXJjN2t2cG9IWTdSakg4TFNcbjQ4NDJreERaR1U2WWdzOWxPcWJDeHBJWWtGSWpjU3RFb0FmQ3h4TU53YlVJdFY3K3hRMzFnY1RzWGJXK0dORVpcbnNVZEowNHZjandQWWYxYVNKczlQMmJPN3BmUFVEQWZaSTE0d0hhbFFNSHppTGFuK1p5aFh6U2N2ZjNMNS9tWHJcblFCVWljWEFONDI5WG1pWGttMXppYUtmMm5sY013U1dxUjQ1QzNxWERVV3EvdFloQ0dTK2RNUE9IRW92VkoydmtcbnlnWU9QVVFqdHRRK0FWbVk0ZUpwMS92T3VxUGVxWGZZU01keWxjREhkUUtCZ1FEMGxaT3F0aW04VzhZZmNuQ0JcblV1bkFjdUdLcm85MjRJSHJGcVpVclU4V1RPdTM3NGdBdTh3YUEyWXBrN3ppQWV1NzdzMlJKOVl1ZDU5UW1aTkVcbjUrbjE1TGMxeDdlQTRVYncxcmRuZUpTQkhqTWZpR3FLTDZQbmkwcG5OQWFrQ0lxRm52dXUzajc4Q0NoSzFEaDRcbjIxeXR6bzRoNEdZUmN1WHlQd1V6MW9pOXBRS0JnUURGNm42Z1pQS1dUdk5hbUNWRUs3amZ3VExraHpPSW5PeWpcbmZUMnd6N2pJUVU3RWpPckpPUnlhUXZjN0JkR2VRdW5hN0M5dUI2UCtmNVBHVzEwMDdVOTNwNEV5cmRiaEVjSUhcblNNV1A0K0FONktNYnpaU3VMdmlQNGN4Ymg2QWNpV0ZUOTl3U2RkU0d0aExJakQxQ3ltRGcrVVlBRHFiY1VkeGFcbi91aWd1VzhNeFFLQmdRQ1FDV0pzSDFrV3p5a3ZMZExwcGkxNG8yOEZuK1ZuQ2JJWkF6NnpFVmxJOWNXL2piV1hcblVRRlN0SHUrc24yQ3o4VEc2VXh3Vm5pQTV2dVFtTkNzdkxNQWwwLzV3UUxsU0VYaDRXRWk4MVRwY1NLRVNHOE5cbnNCNmpabGxMeTh5NVh6cE1sS0w5aVc2b09CbWFiNzVPRmtsUEpoeDRBTkc3SnVJYU5salcvVm1MN1FLQmdCMFJcbkVHSE1FWmlqcGJmamFtMjFvaVF5Z3AvdmYxRU1BdkVMM3JpTitVeG4wd0tvMDM2VUJiQmVMMk1hdXF0c2xsM1Jcbm5ER2pxNkVmNlhzVFJnQVU3anZiZk8wTmZPWjNMakRWcmpZd3VHSXlqV255Nm1nZWUrRGR2NTZkcjVVaFZBcjVcbjl2YzdHT2hqNnlSSy9HQkh5cXlmejNrSXJkYmpxdUl1VjhuckVmVWxBb0dBYkhRK09lS212TEcrY2gwYUhrUHlcbmtOcHZieWNqa1lSMkszUjkybG4zSGFid0ErOFRvZUVpQUovbXRWUjJ3WmZyVHhxQjlEakc0ZWhWbm5HTzY5RGVcbnRCdVhDeFZMUHRHT0EwU1luQzhkcGNHeE1yNVlMR1Foczdjd0p0V1J2OTlLblczT3JZZEMvVldRSS91a0NQRitcbnFoVUF4Z0FwRlZTQ05xWTZTUWJTMlJZPVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImZlc3NvaXJhLWFwaS1zaGVldEBmZXNzb3JhLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwODI4MTc0ODk1NjM3MzQzNTY3NiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvZmVzc29pcmEtYXBpLXNoZWV0JTQwZmVzc29yYS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQo="
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(Buffer.from(credentialsGoogle, 'base64').toString('ascii')),
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