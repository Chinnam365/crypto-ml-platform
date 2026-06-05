class WebSocketEngine {

  constructor() {

    this.connected =
      false;
  }

  connect() {

    this.connected =
      true;

    console.log(
      "WebSocket Connected"
    );
  }

  disconnect() {

    this.connected =
      false;
  }

  status() {

    return this.connected;
  }
}

module.exports =
  new WebSocketEngine();
