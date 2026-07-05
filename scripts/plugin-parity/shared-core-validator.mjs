import path from 'node:path';

import { TEXT_EXTENSIONS } from './constants.mjs';
import { directoryExists, listFilesRecursive, readUtf8 } from './fs-utils.mjs';
import { addViolation } from './violations.mjs';

export function discoverSharedCoreFiles(rootDir, violations) {
  if (!directoryExists(path.join(rootDir, 'skills'))) {
    addViolation(violations, 'missing-directory', 'skills', 'required skills directory is missing');
    return [];
  }

  const allSkillFiles = listFilesRecursive(rootDir, 'skills');
  const selected = new Set();

  for (const file of allSkillFiles) {
    const ext = path.extname(file);
    const segments = file.split('/');
    const isSkillMarkdown = ext === '.md';
    const isTemplateText = segments.includes('templates') && TEXT_EXTENSIONS.has(ext);

    if (isSkillMarkdown || isTemplateText) {
      selected.add(file);
    }
  }

  return [...selected].sort();
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let cursor = 0; cursor < index; cursor += 1) {
    if (text.charCodeAt(cursor) === 10) {
      line += 1;
    }
  }
  return line;
}

export function validateSharedCoreText(rootDir, files, violations) {
  const platformTermPattern = /\b(?:Claude(?:\s+Code)?|Codex)\b/g;

  for (const file of files) {
    const text = readUtf8(path.join(rootDir, file));
    let match;
    while ((match = platformTermPattern.exec(text)) !== null) {
      addViolation(
        violations,
        'shared-core-platform-term',
        file,
        `shared skill/template text contains platform term "${match[0]}"; use agent-neutral wording`,
        lineNumberAt(text, match.index),
      );
    }
  }
}
