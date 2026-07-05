export const REQUIRED_MANIFESTS = [
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.codex-plugin/plugin.json',
];

export const README_FILES = ['README.md', 'README.ko.md'];
export const TEXT_EXTENSIONS = new Set(['.md', '.html']);

export function usage() {
  return `Usage: node scripts/check-plugin-parity.mjs [--self-test] [--help]

Default strict mode validates the current repository for Claude Code/Codex parity:
  - shared plugin name and version across client manifests
  - compatible manifest and marketplace descriptions
  - README platform terms only in allowlisted client-specific contexts
  - no Claude/Codex platform terms in shared skills or template HTML/MD files

Modes:
  --self-test  Build isolated temp fixtures and prove synthetic violations are detected.
  --help       Print this usage text.
`;
}
