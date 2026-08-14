/**
 * Unified logging utility for frontend components.
 *
 * Provides a consistent logging format across all React components:
 * [TIMESTAMP] [LEVEL] [MODULE] - MESSAGE
 *
 * Usage:
 *   const logger = getLogger('TicketModal');
 *   logger.info('Ticket created successfully');
 *   logger.error('Failed to fetch tickets', error);
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

/**
 * Get current timestamp in ISO format.
 *
 * @returns {string} Formatted timestamp like "2026-08-14 14:23:45.123"
 */
function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${date} ${time}.${ms}`;
}

/**
 * Create a logger instance with consistent formatting.
 *
 * @param {string} moduleName - The module/component name for log context
 * @returns {Object} Logger object with debug, info, warn, error methods
 *
 * @example
 *   const logger = getLogger('App');
 *   logger.info('Application initialized');
 *   logger.error('API request failed', new Error('Network error'));
 */
export function getLogger(moduleName) {
  return {
    /**
     * Log debug message.
     *
     * @param {string} message - The message to log
     * @param {*} data - Optional data to log
     */
    debug: (message, data = null) => {
      const timestamp = getTimestamp();
      const msg = `[${timestamp}] [${LOG_LEVELS.DEBUG}] [${moduleName}] - ${message}`;
      if (data) {
        console.debug(msg, data);
      } else {
        console.debug(msg);
      }
    },

    /**
     * Log info message.
     *
     * @param {string} message - The message to log
     * @param {*} data - Optional data to log
     */
    info: (message, data = null) => {
      const timestamp = getTimestamp();
      const msg = `[${timestamp}] [${LOG_LEVELS.INFO}] [${moduleName}] - ${message}`;
      if (data) {
        console.info(msg, data);
      } else {
        console.info(msg);
      }
    },

    /**
     * Log warning message.
     *
     * @param {string} message - The message to log
     * @param {*} data - Optional data to log
     */
    warn: (message, data = null) => {
      const timestamp = getTimestamp();
      const msg = `[${timestamp}] [${LOG_LEVELS.WARN}] [${moduleName}] - ${message}`;
      if (data) {
        console.warn(msg, data);
      } else {
        console.warn(msg);
      }
    },

    /**
     * Log error message.
     *
     * @param {string} message - The message to log
     * @param {Error|*} error - Error object or data to log
     */
    error: (message, error = null) => {
      const timestamp = getTimestamp();
      const msg = `[${timestamp}] [${LOG_LEVELS.ERROR}] [${moduleName}] - ${message}`;
      if (error instanceof Error) {
        console.error(msg, `${error.message}`, error.stack);
      } else if (error) {
        console.error(msg, error);
      } else {
        console.error(msg);
      }
    },
  };
}
