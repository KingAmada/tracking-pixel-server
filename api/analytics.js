import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    const db = client.db("tracking");

    // Aggregate data
    const totalEmailsSent = await db.collection("emailOpens").distinct("email").length;
    const emailsOpened = await db.collection("emailOpens").countDocuments({ isPrefetch: false });
    const openRate = (emailsOpened / totalEmailsSent) * 100;

    const allOpens = await db.collection("emailOpens").find({ isPrefetch: false }).toArray();

    client.close();

    res.status(200).json({
        totalEmailsSent,
        emailsOpened,
        openRate,
        allOpens,
    });
}
