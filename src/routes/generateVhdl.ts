import { Request, Response, Router } from "express";
import { generateVhdl } from "../services/groqService";
import { runSimulation } from "../services/ghdlService";

const router = Router();

router.post(
  "/generate-vhdl",
  async (req: Request, res: Response): Promise<void> => {
    const { description } = req.body;

    if (!description) {
      res.status(400).json({ error: "Missing description" });
      return;
    }

    try {
      const generatedCode = await generateVhdl(description);
      res.json({ code: generatedCode.trim() });
    } catch (error) {
      console.error("Groq API error:", error);
      res.status(500).json({ error: "Failed to generate code" });
    }
  }
);

router.post(
  "/generate-and-test-vhdl",
  async (req: Request, res: Response): Promise<void> => {
    const { description, testbench, topEntity } = req.body;

    if (!description || !testbench || !topEntity) {
      res.status(400).send("Missing design, testbench, or topEntity");
      return;
    }

    try {
      const design = await generateVhdl(description);
      const output = await runSimulation(design, testbench, topEntity);
      res.send({ design: design, simulation_output: output });
    } catch (err) {
      res.status(500).send(`Simulation failed:\n${err}`);
    }
  }
);

export default router;
