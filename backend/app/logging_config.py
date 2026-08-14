"""
Centralized logging configuration for the KSA Ticket System backend.

This module configures Python's standard logging module with a consistent format
used across all backend modules. Format: [TIMESTAMP] [LEVEL] [MODULE] - MESSAGE
"""

import logging
import sys


def setup_logging(log_level: str = "INFO") -> None:
    """
    Configure Python logging with consistent formatting.

    Sets up logging with a timestamp, log level, module name, and message.
    Logs are output to console (stdout/stderr) for development.

    Args:
        log_level (str): Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL).
                        Defaults to "INFO".

    Returns:
        None

    Example:
        >>> setup_logging("DEBUG")
        >>> logger = logging.getLogger(__name__)
        >>> logger.info("Application started")
    """
    # Define logging format: [TIMESTAMP] [LEVEL] [MODULE] - MESSAGE
    log_format = "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    # Create formatter
    formatter = logging.Formatter(log_format, datefmt=date_format)

    # Remove existing handlers to prevent duplicate logs
    root_logger = logging.getLogger()
    root_logger.handlers.clear()

    # Configure root logger
    root_logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    # Add console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the given name.

    Args:
        name (str): Logger name, typically __name__ of the calling module.

    Returns:
        logging.Logger: Configured logger instance.

    Example:
        >>> logger = get_logger(__name__)
        >>> logger.error("An error occurred", exc_info=True)
    """
    return logging.getLogger(name)
