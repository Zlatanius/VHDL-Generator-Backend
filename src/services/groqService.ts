import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateVhdl(description: string): Promise<string> {
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
Follow clean indentation and naming conventions
IMPORTANT: GENERATE NOTHING BUT THE CODE.`,
      },
      {
        role: "user",
        content: description,
      },
    ],
  });

  return chatCompletion.choices[0]?.message?.content ?? "";
}
