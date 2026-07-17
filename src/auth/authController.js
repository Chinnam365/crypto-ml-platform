"use strict";

const authService = require("./authService");
const AppError = require("../utils/AppError");

async function login(req, res, next) {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
      mfaToken: req.body.mfaToken,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      requestId: req.id
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      throw AppError.badRequest(
        "Refresh token is required."
      );
    }

    const tokens = await authService.refresh(
      refreshToken
    );

    res.status(200).json({
      success: true,
      tokens
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    if (!req.user) {
      throw AppError.unauthorized();
    }

    await authService.logout(
      req.user.sessionId,
      {
        userId: req.user.id,
        requestId: req.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged out successfully."
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    if (!req.user) {
      throw AppError.unauthorized();
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        role: req.user.role,
        sessionId: req.user.sessionId,
        mfaVerified: req.user.mfaVerified
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  refresh,
  logout,
  me
};
