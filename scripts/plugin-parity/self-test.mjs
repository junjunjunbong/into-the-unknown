import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { writeFixtureFile } from './fs-utils.mjs';
import { validateRepo } from './validate-repo.mjs';
import { formatViolation } from './violations.mjs';

function writeValidFixture(rootDir) {
  const sharedDescription =
    'Discover your unknowns before, during, and after implementation with agent-neutral skills.';
  const pluginJson = JSON.stringify(
    {
      name: 'into-the-unknown',
      version: '0.0.0-test',
      description: sharedDescription,
    },
    null,
    2,
  );
  const marketplaceJson = JSON.stringify(
    {
      name: 'into-the-unknown',
      metadata: {
        description: sharedDescription,
      },
      plugins: [
        {
          name: 'into-the-unknown',
          source: './',
          description: sharedDescription,
        },
      ],
    },
    null,
    2,
  );

  writeFixtureFile(rootDir, '.claude-plugin/plugin.json', `${pluginJson}\n`);
  writeFixtureFile(rootDir, '.claude-plugin/marketplace.json', `${marketplaceJson}\n`);
  writeFixtureFile(rootDir, '.codex-plugin/plugin.json', `${pluginJson}\n`);
  writeFixtureFile(
    rootDir,
    'README.md',
    `# into-the-unknown

**A Claude Code and Codex plugin that helps you discover unknowns before implementation.**

By Thariq of the Claude Code team.

## Install

### Claude Code

\`\`\`
claude --plugin-dir /path/to/into-the-unknown
\`\`\`

### Codex

\`\`\`
codex plugin marketplace add /path/to/into-the-unknown
\`\`\`
`,
  );
  writeFixtureFile(
    rootDir,
    'README.ko.md',
    `# into-the-unknown

**Claude Code와 Codex에서 unknown을 구현 전에 발견하게 해주는 플러그인.**

Claude Code 팀의 원문에서 출발했습니다.

## 설치

### Claude Code

\`\`\`
claude --plugin-dir /path/to/into-the-unknown
\`\`\`

### Codex

\`\`\`
codex plugin marketplace add /path/to/into-the-unknown
\`\`\`
`,
  );
  writeFixtureFile(
    rootDir,
    'skills/demo/SKILL.md',
    `# demo

The agent checks evidence before it asks the highest-leverage question.
`,
  );
  writeFixtureFile(
    rootDir,
    'skills/demo/templates/demo-template.html',
    `<main>
  <p>The assistant records the user's decision.</p>
</main>
`,
  );
}

function assertSelfTest(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runSelfTest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-parity-self-test-'));
  let cleanupStatus = 'not attempted';

  try {
    writeValidFixture(tempRoot);
    const validResult = validateRepo(tempRoot);
    assertSelfTest(
      validResult.ok,
      `valid fixture should pass, got ${validResult.violations.map(formatViolation).join('\n')}`,
    );

    writeFixtureFile(
      tempRoot,
      'skills/demo/templates/demo-template.html',
      `<main>
  <p>Paste this back to Claude for grading.</p>
</main>
`,
    );
    const platformTermResult = validateRepo(tempRoot);
    const detectedPlatformTerm = platformTermResult.violations.some(
      (violation) => violation.code === 'shared-core-platform-term',
    );
    assertSelfTest(detectedPlatformTerm, 'synthetic generic Claude violation was not detected');

    writeValidFixture(tempRoot);
    writeFixtureFile(tempRoot, '.codex-plugin/plugin.json', '{ "name": "into-the-unknown",\n');
    const malformedJsonResult = validateRepo(tempRoot);
    const detectedMalformedJson = malformedJsonResult.violations.some(
      (violation) => violation.code === 'malformed-json',
    );
    assertSelfTest(detectedMalformedJson, 'synthetic malformed JSON violation was not detected');

    console.log('SELF-TEST PASS');
    console.log('valid fixture: pass');
    console.log('synthetic generic Claude violation: detected');
    console.log('synthetic malformed JSON violation: detected');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    cleanupStatus = fs.existsSync(tempRoot) ? 'failed' : 'removed';
    console.log(`temp cleanup: ${cleanupStatus}`);
  }
}
