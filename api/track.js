import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = "1KbJxNpUHvjEzgmEzthfw2VAUFvWTAYgMiq50pDezMbs"; // Replace with your actual Sheet ID
const RANGE = "Sheet2!A:D"; // Example: Add data to columns A through D

export default async function handler(req, res) {
    const { email } = req.query || "unknown";
    const timestamp = new Date().toISOString();

    try {
        const sheets = google.sheets({ version: "v4", auth });

        // Append data to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: RANGE,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[email, timestamp]],
            },
        });

        console.log(`Logged email open for: ${email}`);

        // Return a 1x1 tracking pixel
        res.setHeader("Content-Type", "image/gif");
        const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
        res.status(200).send(pixel);
    } catch (error) {
        console.error("Error logging to Google Sheets:", error);
        res.status(500).send("Error logging to Google Sheets");
    }
}

