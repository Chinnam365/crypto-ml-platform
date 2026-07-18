"use strict";

const AuthenticationRequestContext = require("./requestContext");

function attachRequestContext(req, res, next) {
  req.authRequestContext =
    new AuthenticationRequestContext(req);

  res.locals.authRequestContext =
    req.authRequestContext;

  res.on("finish", () => {
    req.authRequestContext.complete(
      res.statusCode
    );
  });

  next();
}

function getRequestContext(req) {
  return (
    req.authRequestContext ||
    new AuthenticationRequestContext(req)
  );
}

function requireRequestContext(
  req,
  res,
  next
) {
  if (!req.authRequestContext) {
    req.authRequestContext =
      new AuthenticationRequestContext(req);
  }

  next();
}

function clearRequestContext(
  req,
  res,
  next
) {
  delete req.authRequestContext;
  delete res.locals.authRequestContext;

  next();
}

module.exports = Object.freeze({
  attachRequestContext,
  getRequestContext,
  requireRequestContext,
  clearRequestContext
});
