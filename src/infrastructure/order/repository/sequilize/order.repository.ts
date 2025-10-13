import RepositoryInterface from "../../../../domain/@shared/repository/repository-interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements RepositoryInterface<Order> {
  async update(entity: Order): Promise<void> {
    await OrderModel.update({ total: entity.total() }, { where: { id: entity.id } });

    await OrderItemModel.destroy({ where: { order_id: entity.id } });

    entity.items.forEach(async (item) => {
      await OrderItemModel.create({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      });
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });

    const items: OrderItem[] = orderModel.items.map((oi) => {
      const orderItem = new OrderItem(oi.id, oi.name, oi.price, oi.product_id, oi.quantity);
      return orderItem;
    });

    const order = new Order(orderModel.id, orderModel.customer_id, items);

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orders: Order[] = [];

    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    orderModels.forEach((om) => {
      const items: OrderItem[] = om.items.map((oi) => {
        const orderItem = new OrderItem(oi.id, oi.name, oi.price, oi.product_id, oi.quantity);
        return orderItem;
      });

      const order = new Order(om.id, om.customer_id, items);

      orders.push(order);
    });

    return orders;
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
