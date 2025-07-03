import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractVhdlBlock = (source: string): string => {
  const splitSource = source.split("```");
  let vhdl = splitSource[1] || "";
  if (vhdl.trim().toLowerCase().startsWith("vhdl")) {
    vhdl = vhdl.trim().slice(4).trimStart();
  }
  return vhdl;
};

export async function generateVhdl(description: string): Promise<string> {
  const chatCompletion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
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
All code should be in VHDL 2008 standard
IMPORTANT: GENERATE NOTHING BUT THE CODE. NO TEXT SHOULD BE IN THE RESPONSE!!! DO NOT PUT VHDL AT THE START OF THE FILE!!!`,
      },
      {
        role: "user",
        content: description,
      },
    ],
  });

  return extractVhdlBlock(chatCompletion.choices[0]?.message?.content ?? "");
}

export async function correctVhdl(
  description: string,
  design: string,
  ghdlError: string
): Promise<string> {
  const chatCompletion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    messages: [
      {
        role: "system",
        content:
          "You are a VHDL expert. You fix VHDL code so that it compiles and passes its testbench. Always return the full, corrected VHDL module. Do not explain anything. All code should be in VHDL 2008 standard",
      },
      {
        role: "user",
        content: `The following VHDL module is failing when running in simulation.
Component description:
${description}

Simulation output:
${ghdlError}

Component code:
${design}        `,
      },
    ],
  });

  return extractVhdlBlock(chatCompletion.choices[0]?.message?.content ?? "");
}
