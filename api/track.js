export default async (req, res) => {
    const email = req.query.email || "unknown";
    console.log(`Email opened: ${email}`);
    res.status(200).send(`Tracked email: ${email}`);
};
