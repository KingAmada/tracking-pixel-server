export default function handler(req, res) {
    const { email } = req.query;

    // Log the tracking data (for now, log to the console)
    console.log(`Email opened: ${email} at ${new Date().toISOString()}`);

    // Respond with a transparent 1x1 pixel image
    res.setHeader("Content-Type", "image/gif");
    const pixel = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
        "base64"
    );
    res.status(200).send(pixel);
}
