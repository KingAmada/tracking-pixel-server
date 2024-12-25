import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    const { email } = req.query || "unknown";
    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    const db = client.db("tracking");

    // Log the tracking event
    await db.collection("emailOpens").insertOne({
        email,
        userAgent,
        ip,
        timestamp,
        isPrefetch: userAgent.includes("GoogleImageProxy") || userAgent.includes("Microsoft Outlook"),
    });

    client.close();

    // Respond with a 1x1 pixel
    res.setHeader("Content-Type", "image/gif");
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
    res.status(200).send(pixel);
}
