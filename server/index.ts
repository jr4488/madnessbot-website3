import fs from "fs";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const resolveStaticPath = () => {
  const candidates = [
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(__dirname, "public")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
};

const staticPath = resolveStaticPath();

app.use(express.static(staticPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;

  const server = createServer(app);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

export default app;
