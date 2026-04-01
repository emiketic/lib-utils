/**
 * Reads a file from disk and returns it as a `File`-like object
 * compatible with browser `File` / `FormData` APIs.
 *
 * @param filePath - Absolute or relative path to the file on disk.
 * @param type     - MIME type override (default: `"application/image"`).
 */
declare function getFileFromPath(filePath: string, type?: string): Promise<File>;

export { getFileFromPath };
