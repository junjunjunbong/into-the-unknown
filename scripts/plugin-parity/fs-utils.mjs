import fs from 'node:fs';
import path from 'node:path';

export function relativePath(rootDir, absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join('/');
}

export function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

export function listFilesRecursive(rootDir, startRelativeDir) {
  const startDir = path.join(rootDir, startRelativeDir);
  if (!directoryExists(startDir)) {
    return [];
  }

  const files = [];
  const stack = [startDir];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
      } else if (entry.isFile()) {
        files.push(relativePath(rootDir, absolutePath));
      }
    }
  }

  return files.sort();
}

export function writeFixtureFile(rootDir, relativeFile, content) {
  const absoluteFile = path.join(rootDir, relativeFile);
  fs.mkdirSync(path.dirname(absoluteFile), { recursive: true });
  fs.writeFileSync(absoluteFile, content, 'utf8');
}
