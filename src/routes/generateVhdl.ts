import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// Initialize Groq client with API key from environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/generate-vhdl", async (req, res): Promise<any> => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  try {
    // Send prompt to Groq's LLaMA-3 model
    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a VHDL code generation assistant. Given a component specification, return only valid and complete VHDL code.",
        },
        {
          role: "user",
          content: description,
        },
      ],
    });

    const generatedCode = chatCompletion.choices[0]?.message?.content ?? "";

    res.json({ code: generatedCode.trim() });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

export default router;
