export function addViolation(violations, code, file, message, line = null) {
  violations.push({ code, file, line, message });
}

export function formatViolation(violation) {
  const location = violation.line == null ? violation.file : `${violation.file}:${violation.line}`;
  return `[${violation.code}] ${location} ${violation.message}`;
}
