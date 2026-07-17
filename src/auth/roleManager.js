"use strict";

const {
  ROLE_HIERARCHY,
  getLevel,
  hasRole,
  canManage,
  roleExists,
  listRoles
} = require("./roleHierarchy");

class RoleManager {
  assignRole(currentRole, newRole) {
    if (!roleExists(newRole)) {
      throw new Error(`Unknown role: ${newRole}`);
    }

    return {
      previousRole: currentRole,
      newRole,
      level: getLevel(newRole),
      changedAt: new Date().toISOString()
    };
  }

  promote(currentRole) {
    const roles = listRoles().reverse();
    const index = roles.indexOf(currentRole);

    if (index === -1 || index === roles.length - 1) {
      return currentRole;
    }

    return roles[index + 1];
  }

  demote(currentRole) {
    const roles = listRoles();
    const index = roles.indexOf(currentRole);

    if (index === -1 || index === roles.length - 1) {
      return currentRole;
    }

    return roles[index + 1];
  }

  compare(roleA, roleB) {
    const levelA = getLevel(roleA);
    const levelB = getLevel(roleB);

    if (levelA === levelB) {
      return 0;
    }

    return levelA > levelB ? 1 : -1;
  }

  canAssign(actorRole, targetRole) {
    return canManage(actorRole, targetRole);
  }

  canAccess(actorRole, requiredRole) {
    return hasRole(actorRole, requiredRole);
  }

  getRoleDetails(role) {
    return {
      role,
      exists: roleExists(role),
      level: getLevel(role)
    };
  }

  getAllRoles() {
    return listRoles().map(role => ({
      role,
      level: getLevel(role)
    }));
  }
}

module.exports = new RoleManager();
