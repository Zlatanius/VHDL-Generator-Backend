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
  const scriptPath = path.join(__dirname, "../scripts/run_ghdl.sh");

  // Write the files
  await fs.writeFile(designPath, design);
  await fs.writeFile(testbenchPath, testbench);

  const cmd = `${scriptPath} ${designPath} ${testbenchPath} ${topEntity}`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      resolve(stdout);
    });
  });
}
