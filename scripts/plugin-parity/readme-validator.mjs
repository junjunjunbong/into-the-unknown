import path from 'node:path';

import { README_FILES } from './constants.mjs';
import { fileExists, readUtf8 } from './fs-utils.mjs';
import { addViolation } from './violations.mjs';

function readLines(rootDir, file, violations) {
  const absoluteFile = path.join(rootDir, file);
  if (!fileExists(absoluteFile)) {
    addViolation(violations, 'missing-file', file, 'required file is missing');
    return [];
  }

  return readUtf8(absoluteFile).split(/\r?\n/);
}

function sectionNameForLine(lines, lineIndex) {
  let current = '';
  for (let index = 0; index <= lineIndex; index += 1) {
    const heading = lines[index].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (heading) {
      current = heading[2];
    }
  }
  return current;
}

function isInstallSection(sectionName) {
  return ['Install', '설치', 'Claude Code', 'Codex'].includes(sectionName);
}

function hasBothClientNames(line) {
  return /\bClaude Code\b/.test(line) && /\bCodex\b/.test(line);
}

function isAllowedReadmePlatformLine(line, sectionName) {
  if (hasBothClientNames(line)) {
    return true;
  }

  if (isInstallSection(sectionName)) {
    return true;
  }

  if (/Claude Code (team|팀)/.test(line)) {
    return true;
  }

  return false;
}

function validateOpeningProductLine(readme, lines, violations) {
  const openingProductLine = lines.find((line) => line.trim().startsWith('**')) ?? '';
  if (hasBothClientNames(openingProductLine)) {
    return;
  }

  addViolation(
    violations,
    'readme-first-class-surfaces',
    readme,
    'opening product sentence must name Claude Code and Codex together as first-class surfaces',
    Math.max(1, lines.findIndex((line) => line === openingProductLine) + 1),
  );
}

function validateInstallSections(readme, lines, violations) {
  for (const heading of ['Claude Code', 'Codex']) {
    if (!lines.some((line) => line.trim() === `### ${heading}`)) {
      addViolation(violations, 'readme-install-section', readme, `missing install subsection: ${heading}`);
    }
  }
}

function validatePlatformTerms(readme, lines, violations) {
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const sectionName = sectionNameForLine(lines, index);
    const containsClientName = /\bClaude Code\b|\bCodex\b/.test(line);
    const bareClaudePattern = /\bClaude\b(?!\s+Code)/g;

    if (containsClientName && !isAllowedReadmePlatformLine(line, sectionName)) {
      addViolation(
        violations,
        'readme-platform-context',
        readme,
        `platform name appears outside an allowlisted product, source-attribution, or install context: "${line.trim()}"`,
        lineNumber,
      );
    }

    let bareMatch;
    while ((bareMatch = bareClaudePattern.exec(line)) !== null) {
      addViolation(
        violations,
        'readme-generic-claude',
        readme,
        `generic bare "Claude" appears in README text; use agent-neutral wording unless this is platform-specific`,
        lineNumber,
      );
    }
  });
}

export function validateReadmePlatformTerms(rootDir, violations) {
  for (const readme of README_FILES) {
    const lines = readLines(rootDir, readme, violations);
    if (lines.length === 0) {
      continue;
    }

    validateOpeningProductLine(readme, lines, violations);
    validateInstallSections(readme, lines, violations);
    validatePlatformTerms(readme, lines, violations);
  }
}
