import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const dir = mkdtempSync(join(tmpdir(), "ts-migration-demo-"));
const source = join(dir, "intentional-errors.ts");
const config = join(dir, "tsconfig.json");

writeFileSync(source, `
interface Profile { name: string; age: number; }
const age: number = "twenty"; // Type error: string assigned to number
const profile: Profile = { name: "Sam" }; // Type error: age is missing
function greet(name: string) { return name.toUpperCase(); }
const maybeName: string | undefined = Math.random() > 0.5 ? "Ada" : undefined;
console.log(greet(maybeName)); // Type error: possibly undefined
console.log(age, profile);
`);

writeFileSync(config, JSON.stringify({
  compilerOptions: {
    strict: true,
    noEmit: true,
    target: "ES2022",
    skipLibCheck: true
  },
  files: [source]
}, null, 2));

console.log("Demonstrating compiler-detected migration errors (these errors are intentional):");
const result = spawnSync("npx", ["tsc", "-p", config, "--pretty", "false"], {
  encoding: "utf8",
  shell: process.platform === "win32"
});
const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
console.log(output || "No diagnostics were emitted. Check that TypeScript is installed with npm install.");
const count = (output.match(/error TS\d+:/g) ?? []).length;
console.log(`\nCompiler diagnostics counted: ${count}`);
console.log("These are intentional demonstration errors, not errors in the working application.");
rmSync(dir, { recursive: true, force: true });
