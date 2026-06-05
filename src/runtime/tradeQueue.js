class TradeQueue {

  constructor() {

    this.queue = [];
  }

  enqueue(
    trade
  ) {

    this.queue.push(
      trade
    );
  }

  dequeue() {

    return this.queue.shift();
  }

  size() {

    return this.queue.length;
  }
}

module.exports =
  new TradeQueue();
