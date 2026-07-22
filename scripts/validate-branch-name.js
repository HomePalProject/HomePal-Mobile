const { execSync } = require('node:child_process');

const allowedPrefixes = ['main', 'development', 'feat/', 'fix/', 'refactor/', 'docs/', 'chore/'];

function getBranchName() {
  return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
}

function isValidBranchName(branchName) {
  return allowedPrefixes.some((prefix) => branchName.startsWith(prefix));
}

function main() {
  const branchName = getBranchName();

  if (!isValidBranchName(branchName)) {
    console.error(`Invalid branch name "${branchName}". Use one of: ${allowedPrefixes.join(', ')}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { allowedPrefixes, getBranchName, isValidBranchName };
