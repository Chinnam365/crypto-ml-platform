"use strict";

const errorHandler = require("./errorHandler");

function authenticationErrorMiddleware(
  err,
  req,
  res,
  next
) {
  return errorHandler.handle(
    err,
    req,
    res,
    next
  );
}

function notFoundMiddleware(
  req,
  res
) {
  return errorHandler.notFound(
    req,
    res
  );
}

function methodNotAllowedMiddleware(
  req,
  res
) {
  return errorHandler.methodNotAllowed(
    req,
    res
  );
}

function unauthorizedMiddleware(
  req,
  res
) {
  return errorHandler.unauthorized(
    res
  );
}

function forbiddenMiddleware(
  req,
  res
) {
  return errorHandler.forbidden(
    res
  );
}

function validationErrorMiddleware(
  errors
) {
  return (req, res) =>
    errorHandler.validation(
      res,
      errors
    );
}

module.exports = Object.freeze({
  authenticationErrorMiddleware,
  notFoundMiddleware,
  methodNotAllowedMiddleware,
  unauthorizedMiddleware,
  forbiddenMiddleware,
  validationErrorMiddleware
});
