/**
 * Custom Error Classes for better error handling
 */

export class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR', details = null) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NetworkError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

export class ApiError extends Error {
  constructor(message, status = null, response = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}
