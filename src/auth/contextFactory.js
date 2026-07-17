"use strict";

const UserContext = require("./userContext");
const { getPermissions } = require("./permissions");

class ContextFactory {
  create(user = {}, session = {}) {
    const context = new UserContext(user, session);

    if (
      context.permissions.length === 0 &&
      context.role
    ) {
      context.permissions = getPermissions(
        context.role
      );
    }

    return context;
  }

  fromRequest(req = {}) {
    return this.create(
      req.user || {},
      req.session || {}
    );
  }

  fromToken(token = {}) {
    return this.create(
      {
        id: token.userId,
        email: token.email,
        role: token.role
      },
      {
        sessionId: token.sessionId,
        mfaVerified: token.mfaVerified,
        ipAddress: token.ipAddress,
        userAgent: token.userAgent
      }
    );
  }

  anonymous() {
    return new UserContext(
      {
        role: "GUEST",
        permissions: []
      },
      {}
    );
  }

  clone(context) {
    return new UserContext(
      {
        id: context.userId,
        email: context.email,
        role: context.role,
        permissions: [...context.permissions]
      },
      {
        sessionId: context.sessionId,
        mfaVerified: context.mfaVerified,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent
      }
    );
  }
}

module.exports = new ContextFactory();
