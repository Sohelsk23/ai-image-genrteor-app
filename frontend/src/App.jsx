import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);

  const generate = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt.");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/generate", { prompt });
      setImage(res.data.image);
      setGallery((g) => [res.data.image, ...g].slice(0, 12));
    } catch (err) {
      console.error(err);
      alert("Generation failed — check backend and API key.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (dataUrl) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "ai-image.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b3268] text-white p-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-extrabold mb-2">
          🎨 AI Image Generator Pro
        </motion.h1>
        <p className="text-sm opacity-80 mb-6">Create beautiful, high-quality images from text prompts.</p>

        <div className="flex gap-3">
          <input
            className="flex-1 p-3 rounded-xl text-black"
            placeholder={`e.g. "A cyberpunk city at sunset, cinematic, 8k"`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" onClick={generate}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {image && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <img src={image} alt="AI" className="rounded-xl max-h-[500px] w-full object-contain shadow-xl" />
            <div className="mt-3 flex gap-3">
              <button onClick={() => downloadImage(image)} className="px-4 py-2 rounded-lg bg-white/10">Download</button>
              <button onClick={() => setImage(null)} className="px-4 py-2 rounded-lg bg-white/10">Close</button>
            </div>
          </motion.div>
        )}

        {gallery.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <img key={i} src={g} alt={`gen-${i}`} className="rounded-lg cursor-pointer" onClick={() => setImage(g)} />
            ))}
          </div>
        )}

        <div className="mt-6 text-xs opacity-70">⚠️ Keep your API key private. Add it to <code>backend/.env</code> locally.</div>
      </div>
    </div>
  );
}
