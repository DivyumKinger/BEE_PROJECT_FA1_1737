const chalk = require('chalk');

function formatFeedback(text) {
  if (text.toLowerCase().includes('bad') || text.toLowerCase().includes('boring')) {
    return chalk.red(text);
  }
  if (text.toLowerCase().includes('good') || text.toLowerCase().includes('great')) {
    return chalk.green(text);
  }
  return chalk.yellow(text);
}

module.exports = { formatFeedback };
