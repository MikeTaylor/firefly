// Simple wrapper for categorical-logger that configures from environment

const Logger = require('categorical-logger');

module.exports = class {
  constructor(prefix, timestamp) {
    return new Logger(process.env.LOGGING_CATEGORIES || process.env.LOGCAT, prefix, timestamp);
  }
};
