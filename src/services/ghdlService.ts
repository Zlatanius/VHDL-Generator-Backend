import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

export async function runSimulation(
  design: string,
  testbench: string,
  topEntity: string
): Promise<string> {
  const vhdlDir = path.join(__dirname, "../ghdl");
  const designPath = path.join(vhdlDir, "design.vhd");
  const testbenchPath = path.join(vhdlDir, "testbench.vhd");
  const scriptPath = path.join(vhdlDir, "simulation/run_ghdl.sh");

  // Write the files
  await fs.writeFile(designPath, design);
  await fs.writeFile(testbenchPath, testbench);

  console.log("Calling simulation script");

  const cmd = `cd src/ghdl/simulation && ${scriptPath} design.vhd testbench.vhd ${topEntity}`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
}
