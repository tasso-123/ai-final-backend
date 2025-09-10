const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Multer for file uploads
const upload = multer();

// Root route
app.get("/", (req, res) => {
  res.send("AI Bag Customizer server running ✅");
});

// Generate mockup endpoint
app.post("/api/generate-mockup", upload.single("logo"), async (req, res) => {
  const { bagType, phone, address, slogan } = req.body;
  const logoFile = req.file;

  if (!bagType || !logoFile) {
    return res.status(400).json({ error: "Missing bagType or logo" });
  }

  try {
    const logoBase64 = logoFile.buffer.toString("base64");

    const prompt = `
      Create a realistic product mockup of a ${bagType}.
      Overlay this logo (base64): ${logoBase64}.
      Add these details:
      - Phone: ${phone || ""}
      - Address: ${address || ""}
      - Slogan: "${slogan || ""}"
    `;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ backticks lagaye
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, n: 1, size: "512x512" }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    res.json({
      message: "Mockup generated successfully!",
      imageUrl: data.data[0].url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate mockup" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`); // ✅ backticks use kare
});
