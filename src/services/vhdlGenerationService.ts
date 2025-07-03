import { generateVhdl, correctVhdl } from "./groqService";
import { runSimulation } from "./ghdlService";

export async function generateAndTestVhdl(
  description: string,
  testbench: string,
  topEntity: string
) {
  let design = await generateVhdl(description);
  let simulation_output = null;
  let simulation_error = null;
  let corrected = false;
  const maxTries = 2; // Set the number of correction attempts
  let attempt = 0;

  while (attempt < parseInt(process.env.MAX_ATTEMPTS || "1", 10)) {
    try {
      simulation_output = await runSimulation(design, testbench, topEntity);
      simulation_error = null;
      break;
    } catch (err) {
      simulation_error = String(err);
      if (attempt === maxTries) {
        break;
      }
      corrected = true;
      design = await correctVhdl(description, design, simulation_error);
    }
    attempt++;
  }

  return {
    design,
    simulation_output,
    simulation_error,
    corrected,
    attempts: attempt + 1,
  };
}
