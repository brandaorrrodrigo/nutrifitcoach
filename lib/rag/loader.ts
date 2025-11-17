import fs from "fs";
import path from "path";

export function loadLibrary(dir: string): { file: string; content: string }[] {
  const files: { file: string; content: string }[] = [];

  function walk(d: string) {
    const items = fs.readdirSync(d);
    for (const item of items) {
      const full = path.join(d, item);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) walk(full);
      else if (full.endsWith(".md") || full.endsWith(".txt")) {
        const content = fs.readFileSync(full, "utf8");
        files.push({ file: full, content });
      }
    }
  }

  walk(dir);
  return files;
}
