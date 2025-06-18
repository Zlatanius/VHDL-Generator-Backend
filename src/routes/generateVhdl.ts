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
          content: `You are a hardware engineer writing VHDL for synthesis on an FPGA. Given the following component specification, write a complete VHDL module following RTL design principles:

Use IEEE standard libraries: IEEE.STD_LOGIC_1164.ALL, IEEE.NUMERIC_STD.ALL
Use one clock domain, with rising edge sensitivity
All logic must be clocked and synchronous, except for purely combinational outputs
Use one process per clocked logic block, and a separate process for purely combinational logic
All inputs and outputs should use std_logic or std_logic_vector
Avoid latches; initialize all registers properly
Include comments for each part of the architecture
Follow clean indentation and naming conventions`,
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
