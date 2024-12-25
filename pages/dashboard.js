import { useState, useEffect } from "react";

export default function Dashboard() {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetch("/api/analytics")
            .then((res) => res.json())
            .then((data) => setAnalytics(data));
    }, []);

    if (!analytics) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Email Open Analytics</h1>
            <div style={{ marginBottom: "20px" }}>
                <p>Total Emails Sent: {analytics.totalEmailsSent}</p>
                <p>Emails Opened: {analytics.emailsOpened}</p>
                <p>Open Rate: {analytics.openRate.toFixed(2)}%</p>
            </div>
            <h2>Details of Opens</h2>
            <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Timestamp</th>
                        <th>User Agent</th>
                        <th>IP</th>
                    </tr>
                </thead>
                <tbody>
                    {analytics.allOpens.map((open, index) => (
                        <tr key={index}>
                            <td>{open.email}</td>
                            <td>{open.timestamp}</td>
                            <td>{open.userAgent}</td>
                            <td>{open.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
