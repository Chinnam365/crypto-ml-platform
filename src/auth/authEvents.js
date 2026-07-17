"use strict";

const EventEmitter = require("events");

class AuthEvents extends EventEmitter {
  constructor() {
    super();

    this.setMaxListeners(100);

    this.eventsHistory = [];
    this.maxHistory = 1000;
  }

  emitEvent(eventName, payload = {}) {
    const event = {
      id: crypto.randomUUID(),
      event: eventName,
      timestamp: new Date().toISOString(),
      payload
    };

    this.eventsHistory.push(event);

    if (this.eventsHistory.length > this.maxHistory) {
      this.eventsHistory.shift();
    }

    this.emit(eventName, event);

    return event;
  }

  getHistory(limit = 100) {
    return this.eventsHistory.slice(-limit);
  }

  getEvents(eventName) {
    return this.eventsHistory.filter(
      event => event.event === eventName
    );
  }

  clearHistory() {
    this.eventsHistory = [];
  }

  statistics() {
    const counts = {};

    for (const event of this.eventsHistory) {
      counts[event.event] =
        (counts[event.event] || 0) + 1;
    }

    return {
      totalEvents: this.eventsHistory.length,
      eventTypes: Object.keys(counts).length,
      counts
    };
  }
}

const crypto = require("crypto");

module.exports = new AuthEvents();
