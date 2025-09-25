import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({ error: "Prompt too short" });
    }

    // Call Stability.ai image endpoint (example)
    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        prompt,
        output_format: "png"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    const imageBase64 = Buffer.from(response.data, "binary").toString("base64");
    res.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (err) {
    console.error("Generation error:", err?.message || err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
