import { google } from "googleapis";
import { readFileSync } from "fs";
import { join } from "path";

// Load service account credentials
const credentials = JSON.parse(
    readFileSync(join(process.cwd(), "credentials.json"), "utf-8")
);

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
});

// Google Sheets configuration
const SHEET_ID = "1KbJxNpUHvjEzgmEzthfw2VAUFvWTAYgMiq50pDezMbs"; // Replace with your actual sheet ID
const RANGE = "Sheet2!A:D"; // Replace with your target range (e.g., A to D columns)

export default async function handler(req, res) {
    const { email } = req.query || "unknown";
    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    try {
        // Authenticate and connect to Google Sheets
        const sheets = google.sheets({ version: "v4", auth });
        
        // Append data to the sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: RANGE,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[email, userAgent, ip, timestamp]],
            },
        });

        console.log(`Logged email open for: ${email}`);

        // Respond with a tracking pixel
        res.setHeader("Content-Type", "image/gif");
        const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
        res.status(200).send(pixel);
    } catch (error) {
        console.error("Error logging to Google Sheets:", error);
        res.status(500).send("Error logging to Google Sheets");
    }
}
