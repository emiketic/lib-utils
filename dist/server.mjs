// src/server.ts
import fs from "fs/promises";
import { File as NodeFile } from "formdata-node";
async function getFileFromPath(filePath, type) {
  const buffer = await fs.readFile(filePath);
  const file = new NodeFile([buffer], filePath.split("/").pop() ?? "", {
    type: type ?? "application/image"
  });
  return file;
}
export {
  getFileFromPath
};
//# sourceMappingURL=server.mjs.map