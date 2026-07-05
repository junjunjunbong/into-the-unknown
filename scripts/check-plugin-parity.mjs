#!/usr/bin/env node

import process from 'node:process';

import { usage } from './plugin-parity/constants.mjs';
import { printValidationResult, validateRepo } from './plugin-parity/validate-repo.mjs';
import { runSelfTest } from './plugin-parity/self-test.mjs';

function main() {
  const args = process.argv.slice(2);

  if (args.length > 1 || args.some((arg) => !['--help', '-h', '--self-test'].includes(arg))) {
    console.error(usage());
    process.exitCode = 2;
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  if (args.includes('--self-test')) {
    try {
      runSelfTest();
    } catch (error) {
      console.error('SELF-TEST FAIL');
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
    return;
  }

  const result = validateRepo(process.cwd());
  printValidationResult(result);
  process.exitCode = result.ok ? 0 : 1;
}

main();
