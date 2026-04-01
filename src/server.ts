/* -------------------------------------------------------------------------- */
/*                              Server-only Utils                             */
/* -------------------------------------------------------------------------- */
// This module uses Node.js APIs (fs) and must only be imported in server-side code.
// Import via: import { ... } from '@emiketic/lib-utils/server'

import fs from 'fs/promises';
import { File as NodeFile } from 'formdata-node';

/**
 * Reads a file from disk and returns it as a `File`-like object
 * compatible with browser `File` / `FormData` APIs.
 *
 * @param filePath - Absolute or relative path to the file on disk.
 * @param type     - MIME type override (default: `"application/image"`).
 */
export async function getFileFromPath(filePath: string, type?: string): Promise<File> {
  const buffer = await fs.readFile(filePath);
  const file = new NodeFile([buffer], filePath.split('/').pop() ?? '', {
    type: type ?? 'application/image',
  });
  return file as unknown as File;
}
