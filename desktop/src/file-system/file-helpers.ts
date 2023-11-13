import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

export function createDirIfMissing(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function createFileAndDirectoryIfRequired(
  path: string,
  content: string
) {
  const dir = dirname(path);
  createDirIfMissing(dir);
  writeFileSync(path, content);
}

export function createDirForFileIfMissing(path: string) {
  const dir = dirname(path);
  createDirIfMissing(dir);
}
