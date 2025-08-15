import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL provided");

    try {
        const response = await fetch(targetUrl);
        let html = await response.text();

        const base = targetUrl.split("/").slice(0, 3).join("/");
        html = html.replace(/(href|src)="\//g, `$1="${base}/`);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "text/html");
        res.send(html);
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
