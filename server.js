import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Gunakan EJS untuk render template
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Route sitemap
app.get("/sitemap", async (req, res) => {
  try {
    const feedUrl = "https://www.labibalwasi.com/feeds/posts/summary?alt=json";
    const response = await fetch(feedUrl);
    const data = await response.json();

    const entries = data.feed.entry || [];
    const articles = entries.map((entry) => {
      const title = entry.title.$t;
      const link = entry.link.find((l) => l.rel === "alternate").href;
      const date = new Date(entry.published.$t);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      return { title, link, formattedDate };
    });

    res.render("sitemap", { articles });
  } catch (err) {
    console.error("Gagal mengambil feed:", err);
    res.status(500).send("Gagal memuat sitemap.");
  }
});

app.listen(PORT, () => console.log(`🚀 Server jalan di http://localhost:${PORT}`));
