class OrderManager {

  constructor() {

    this.orders = [];
  }

  addOrder(
    order
  ) {

    this.orders.push(
      order
    );

    return order;
  }

  getOpenOrders() {

    return this.orders.filter(

      order =>

        order.status !==
        "FILLED"
    );
  }

  getAllOrders() {

    return this.orders;
  }
}

module.exports =
  new OrderManager();
