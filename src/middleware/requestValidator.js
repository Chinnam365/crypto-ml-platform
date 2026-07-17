"use strict";

const { validationResult } = require("express-validator");

const AppError = require("../utils/AppError");

function validate(validations = []) {
  return async (req, res, next) => {
    try {
      for (const validation of validations) {
        await validation.run(req);
      }

      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      const formattedErrors = errors.array().map((error) => ({
        field: error.path || error.param,
        value: error.value,
        message: error.msg,
        location: error.location
      }));

      return next(
        AppError.validation(
          "Request validation failed.",
          formattedErrors
        )
      );
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = validate;
