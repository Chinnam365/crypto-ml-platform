"use strict";

const express = require("express");
const { body } = require("express-validator");

const controller = require("./authController");

const validate = require("../middleware/requestValidator");

const {
  authenticateAccessToken
} = require("../middleware/authentication");

const {
  authLimiter
} = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/login",
  authLimiter,
  validate([
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email address is required.")
      .normalizeEmail(),

    body("password")
      .isString()
      .isLength({ min: 12 })
      .withMessage("Password is required."),

    body("mfaToken")
      .optional()
      .isLength({ min: 6, max: 8 })
      .withMessage("Invalid MFA token.")
  ]),
  controller.login
);

router.post(
  "/refresh",
  authLimiter,
  validate([
    body("refreshToken")
      .isString()
      .notEmpty()
      .withMessage("Refresh token is required.")
  ]),
  controller.refresh
);

router.post(
  "/logout",
  authenticateAccessToken,
  controller.logout
);

router.get(
  "/me",
  authenticateAccessToken,
  controller.me
);

module.exports = router;
