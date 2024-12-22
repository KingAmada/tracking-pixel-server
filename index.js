const express = require("express");
const { google } = require("googleapis");
const app = express();
const port = process.env.PORT || 3000;

app.get("/tracking/pixel", async (req, res) => {
    const recipientId = req.query.id; // Unique identifier for the recipient

    if (recipientId) {
        try {
            // Authenticate and access Google Sheets
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                },
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });

            const sheets = google.sheets({ version: "v4", auth });
            const spreadsheetId = process.env.GOOGLE_SHEET_ID;

            // Locate the recipient in the Google Sheet and update the "Opened" status
            const range = "Sheet1!A2:F"; // Adjust range as needed
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            const rows = response.data.values || [];
            const updatedRows = rows.map((row) => {
                if (row[1] === recipientId) {
                    row[4] = "Opened"; // Assume column E stores the status
                }
                return row;
            });

            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: "Sheet1!A2:F",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: updatedRows,
                },
            });

            console.log(`Updated recipient ${recipientId} as "Opened"`);
        } catch (error) {
            console.error("Error updating sheet:", error);
        }
    }

    // Respond with a 1x1 transparent GIF
    res.set("Content-Type", "image/gif");
    res.send(Buffer.from("R0lGODlhAQABAAAAACwAAAAAAQABAAA=", "base64"));
});

app.listen(port, () => {
    console.log(`Tracking pixel server running on port ${port}`);
});
