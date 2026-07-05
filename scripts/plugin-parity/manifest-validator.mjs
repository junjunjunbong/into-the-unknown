import path from 'node:path';

import { fileExists, readUtf8 } from './fs-utils.mjs';
import { addViolation } from './violations.mjs';

export function parseJsonFile(rootDir, relativeFile, violations) {
  const absoluteFile = path.join(rootDir, relativeFile);
  if (!fileExists(absoluteFile)) {
    addViolation(violations, 'missing-file', relativeFile, 'required file is missing');
    return null;
  }

  try {
    return JSON.parse(readUtf8(absoluteFile));
  } catch (error) {
    addViolation(violations, 'malformed-json', relativeFile, error.message);
    return null;
  }
}

export function manifestsForFile(manifests, file) {
  if (file === '.claude-plugin/plugin.json') {
    return manifests.claudePlugin;
  }
  if (file === '.claude-plugin/marketplace.json') {
    return manifests.marketplace;
  }
  if (file === '.codex-plugin/plugin.json') {
    return manifests.codexPlugin;
  }
  return null;
}

function asString(value) {
  return typeof value === 'string' ? value : '';
}

function collectManifestDescriptions(manifests) {
  const descriptions = [];
  const claudeDescription = asString(manifests.claudePlugin?.description);
  const codexDescription = asString(manifests.codexPlugin?.description);
  const marketplaceMetadataDescription = asString(manifests.marketplace?.metadata?.description);

  descriptions.push({
    label: '.claude-plugin/plugin.json description',
    file: '.claude-plugin/plugin.json',
    value: claudeDescription,
  });
  descriptions.push({
    label: '.codex-plugin/plugin.json description',
    file: '.codex-plugin/plugin.json',
    value: codexDescription,
  });
  descriptions.push({
    label: '.claude-plugin/marketplace.json metadata.description',
    file: '.claude-plugin/marketplace.json',
    value: marketplaceMetadataDescription,
  });

  if (Array.isArray(manifests.marketplace?.plugins)) {
    manifests.marketplace.plugins.forEach((plugin, index) => {
      descriptions.push({
        label: `.claude-plugin/marketplace.json plugins[${index}].description`,
        file: '.claude-plugin/marketplace.json',
        value: asString(plugin?.description),
      });
    });
  }

  return descriptions;
}

export function validateManifestParity(manifests, violations) {
  const nameChecks = [
    ['.claude-plugin/plugin.json', manifests.claudePlugin?.name],
    ['.codex-plugin/plugin.json', manifests.codexPlugin?.name],
    ['.claude-plugin/marketplace.json', manifests.marketplace?.name],
  ];

  if (Array.isArray(manifests.marketplace?.plugins)) {
    manifests.marketplace.plugins.forEach((plugin, index) => {
      nameChecks.push([`.claude-plugin/marketplace.json plugins[${index}]`, plugin?.name]);
    });
  }

  const stringNames = nameChecks.filter(([, value]) => typeof value === 'string' && value.length > 0);
  const expectedName = stringNames[0]?.[1];

  for (const [file, value] of nameChecks) {
    if (typeof value !== 'string' || value.length === 0) {
      addViolation(violations, 'manifest-name', file, 'missing string name');
    } else if (expectedName !== undefined && value !== expectedName) {
      addViolation(violations, 'manifest-name', file, `expected name "${expectedName}", got "${value}"`);
    }
  }

  const versionChecks = [
    ['.claude-plugin/plugin.json', manifests.claudePlugin?.version],
    ['.codex-plugin/plugin.json', manifests.codexPlugin?.version],
  ];
  if (typeof manifests.marketplace?.version === 'string') {
    versionChecks.push(['.claude-plugin/marketplace.json', manifests.marketplace.version]);
  }

  const stringVersions = versionChecks.filter(([, value]) => typeof value === 'string' && value.length > 0);
  const expectedVersion = stringVersions[0]?.[1];

  for (const [file, value] of versionChecks) {
    if (typeof value !== 'string' || value.length === 0) {
      addViolation(violations, 'manifest-version', file, 'missing string version');
    } else if (expectedVersion !== undefined && value !== expectedVersion) {
      addViolation(violations, 'manifest-version', file, `expected version "${expectedVersion}", got "${value}"`);
    }
  }

  const descriptions = collectManifestDescriptions(manifests);
  const promiseChecks = [
    ['unknowns', /\bunknowns?\b/i],
    ['before/during/after implementation', /\bbefore\b[\s\S]{0,120}\bduring\b[\s\S]{0,120}\bafter\b[\s\S]{0,120}\bimplementation\b/i],
  ];

  for (const description of descriptions) {
    if (description.value.length === 0) {
      addViolation(violations, 'manifest-description', description.file, `${description.label} is missing`);
      continue;
    }

    for (const [label, pattern] of promiseChecks) {
      if (!pattern.test(description.value)) {
        addViolation(
          violations,
          'manifest-description',
          description.file,
          `${description.label} does not preserve product promise term: ${label}`,
        );
      }
    }
  }
}
