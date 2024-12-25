export default function handler(req, res) {
    const email = req.query.email || "unknown";
    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    // Log all requests
    console.log(`Hit: Email: ${email}, IP: ${ip}, User-Agent: ${userAgent}, Time: ${timestamp}`);

    // Filter out known prefetch User-Agents
    const knownPrefetchAgents = ["GoogleImageProxy", "Microsoft Outlook"];
    if (knownPrefetchAgents.some((agent) => userAgent.includes(agent))) {
        console.log(`Prefetch detected: ${email}`);
    } else {
        console.log(`Real open: ${email}`);
    }

    // Respond with tracking pixel
    res.setHeader("Content-Type", "image/gif");
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");
    res.status(200).send(pixel);
}
