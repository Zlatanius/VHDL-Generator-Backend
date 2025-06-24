import { Request, Response, Router } from "express";
import { generateVhdl } from "../services/groqService";
import { generateAndTestVhdl } from "../services/vhdlGenerationService";

const router = Router();

router.post(
  "/generate-vhdl",
  async (req: Request, res: Response): Promise<void> => {
    const { description } = req.body;

    console.log("generate-vhdl route called");

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

    console.log("generate-and-test-vhdl route called");

    if (!description || !testbench || !topEntity) {
      res.status(400).send("Missing design, testbench, or topEntity");
      return;
    }

    try {
      const result = await generateAndTestVhdl(
        description,
        testbench,
        topEntity
      );
      console.log(JSON.stringify(result, null, 2));
      res.send(result);
    } catch (err) {
      res
        .status(500)
        .send({ error: `VHDL generation and simulation failed:\n${err}` });
    }
  }
);

export default router;
