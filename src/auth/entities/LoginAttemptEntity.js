"use strict";

class LoginAttemptEntity {
  constructor(data = {}) {
    this.id = data.id || null;

    this.userId =
      data.userId || data.user_id || null;

    this.email =
      data.email || null;

    this.ipAddress =
      data.ipAddress || data.ip_address || null;

    this.userAgent =
      data.userAgent || data.user_agent || null;

    this.requestId =
      data.requestId || data.request_id || null;

    this.result =
      data.result || "FAILED";

    this.failureReason =
      data.failureReason ||
      data.failure_reason ||
      null;

    this.country =
      data.country || null;

    this.city =
      data.city || null;

    this.latitude =
      data.latitude || null;

    this.longitude =
      data.longitude || null;

    this.createdAt = data.createdAt
      ? new Date(data.createdAt)
      : data.created_at
      ? new Date(data.created_at)
      : new Date();
  }

  isSuccessful() {
    return this.result === "SUCCESS";
  }

  isFailure() {
    return !this.isSuccessful();
  }

  markSuccessful() {
    this.result = "SUCCESS";
    this.failureReason = null;
  }

  markFailed(reason) {
    this.result = "FAILED";
    this.failureReason = reason;
  }

  toDatabase() {
    return {
      id: this.id,
      user_id: this.userId,
      email: this.email,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      request_id: this.requestId,
      result: this.result,
      failure_reason: this.failureReason,
      country: this.country,
      city: this.city,
      latitude: this.latitude,
      longitude: this.longitude,
      created_at: this.createdAt
    };
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      email: this.email,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      requestId: this.requestId,
      result: this.result,
      failureReason: this.failureReason,
      country: this.country,
      city: this.city,
      latitude: this.latitude,
      longitude: this.longitude,
      createdAt: this.createdAt
    };
  }

  static fromDatabase(row) {
    return new LoginAttemptEntity(row);
  }
}

module.exports = LoginAttemptEntity;
