import { README_FILES, REQUIRED_MANIFESTS } from './constants.mjs';
import { manifestsForFile, parseJsonFile, validateManifestParity } from './manifest-validator.mjs';
import { validateReadmePlatformTerms } from './readme-validator.mjs';
import { discoverSharedCoreFiles, validateSharedCoreText } from './shared-core-validator.mjs';
import { formatViolation } from './violations.mjs';

export function validateRepo(rootDir) {
  const violations = [];
  const manifests = {
    claudePlugin: parseJsonFile(rootDir, '.claude-plugin/plugin.json', violations),
    marketplace: parseJsonFile(rootDir, '.claude-plugin/marketplace.json', violations),
    codexPlugin: parseJsonFile(rootDir, '.codex-plugin/plugin.json', violations),
  };

  if (REQUIRED_MANIFESTS.every((file) => manifestsForFile(manifests, file) !== null)) {
    validateManifestParity(manifests, violations);
  }

  validateReadmePlatformTerms(rootDir, violations);
  const sharedCoreFiles = discoverSharedCoreFiles(rootDir, violations);
  validateSharedCoreText(rootDir, sharedCoreFiles, violations);

  return {
    ok: violations.length === 0,
    violations,
    checked: {
      manifests: REQUIRED_MANIFESTS.length,
      readmes: README_FILES.length,
      sharedCoreFiles: sharedCoreFiles.length,
    },
  };
}

export function printValidationResult(result) {
  if (result.ok) {
    console.log('Plugin parity check passed.');
    console.log(
      `Checked ${result.checked.manifests} manifests, ${result.checked.readmes} READMEs, ${result.checked.sharedCoreFiles} skill/template files.`,
    );
    return;
  }

  console.error(`Plugin parity check failed: ${result.violations.length} violation(s).`);
  for (const violation of result.violations) {
    console.error(formatViolation(violation));
  }
}
