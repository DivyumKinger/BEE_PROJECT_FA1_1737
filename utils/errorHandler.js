const chalk = require('chalk');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const ErrorMessages = {
  400: 'Bad Request: Invalid input provided',
  401: 'Unauthorized: Invalid credentials',
  403: 'Forbidden: Access denied',
  404: 'Not Found: Resource not found',
  429: 'Too Many Requests: Rate limit exceeded',
  500: 'Internal Server Error: Something went wrong',
};

function handleError(error) {
  if (error instanceof AppError) {
    const statusCode = error.statusCode;
    const message = error.message || ErrorMessages[statusCode];

    console.log(chalk.red(`\n❌ Error ${statusCode}: ${message}`));

    switch (statusCode) {
      case 400:
        console.log(chalk.yellow('💡 Please check your input and try again.'));
        break;
      case 401:
        console.log(
          chalk.yellow('💡 Please check your username and password.')
        );
        break;
      case 403:
        console.log(
          chalk.yellow("💡 You don't have permission to perform this action.")
        );
        break;
      case 404:
        console.log(chalk.yellow('💡 The requested resource was not found.'));
        break;
      case 429:
        console.log(
          chalk.yellow('💡 Please wait a moment before trying again.')
        );
        break;
      case 500:
        console.log(
          chalk.yellow('💡 Please try again later or contact support.')
        );
        break;
      default:
        console.log(chalk.yellow('💡 Please try again.'));
    }
  } else {
    console.log(chalk.red('❌ Unexpected error occurred:'), error.message);
  }

  process.exit(1);
}

function validateInput(input, fieldName, required = true) {
  if (required && (!input || input.trim() === '')) {
    throw new AppError(
      `${fieldName} is required and cannot be empty`,
      ErrorCodes.BAD_REQUEST
    );
  }

  if (input && input.length > 500) {
    throw new AppError(
      `${fieldName} cannot exceed 500 characters`,
      ErrorCodes.BAD_REQUEST
    );
  }

  return input.trim();
}

function validateCourseCode(courseCode) {
  const validPattern = /^[A-Z]{2,4}\d{1,4}$/;
  if (!validPattern.test(courseCode)) {
    throw new AppError(
      'Course code must be in format like CS01, MATH101, etc.',
      ErrorCodes.BAD_REQUEST
    );
  }
  return courseCode;
}

module.exports = {
  AppError,
  ErrorCodes,
  ErrorMessages,
  handleError,
  validateInput,
  validateCourseCode,
};
