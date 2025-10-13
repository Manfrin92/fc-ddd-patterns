import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await orderRepository.find(order.id);

    expect(orderModel.id).toBe("123");
    expect(orderModel.customerId).toBe("123");
    expect(orderModel.total).toBe(order.total);
    expect(orderModel.items.length).toBe(order.items.length);
    expect(orderModel.items[0].id).toBe(order.items[0].id);
    expect(orderModel.items[0].name).toBe(order.items[0].name);
    expect(orderModel.items[0].price).toBe(order.items[0].price);
    expect(orderModel.items[0].quantity).toBe(order.items[0].quantity);
    expect(orderModel.items[0].productId).toBe(order.items[0].productId);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModels = await orderRepository.findAll();

    expect(orderModels.length).toBe(1);
    expect(orderModels[0].id).toBe("123");
    expect(orderModels[0].customerId).toBe("123");
    expect(orderModels[0].total).toBe(order.total);
    expect(orderModels[0].items.length).toBe(order.items.length);
    expect(orderModels[0].items[0].id).toBe(order.items[0].id);
    expect(orderModels[0].items[0].name).toBe(order.items[0].name);
    expect(orderModels[0].items[0].price).toBe(order.items[0].price);
    expect(orderModels[0].items[0].quantity).toBe(order.items[0].quantity);
    expect(orderModels[0].items[0].productId).toBe(order.items[0].productId);
  });

  it("update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    
    const order = new Order("123", "123", [orderItem]);
    
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderItem2 = new OrderItem(
      "2",
      "Product 2",
      product.price,
      product.id,
      100
    );

    order.addItem([orderItem2]);

    await orderRepository.update(order);

    const orderModels = await orderRepository.findAll();

    expect(orderModels.length).toBe(1);
    expect(orderModels[0].id).toBe("123");
    expect(orderModels[0].customerId).toBe("123");
    expect(orderModels[0].total).toBe(order.total);
    expect(orderModels[0].items.length).toBe(2);
    //first order item
    expect(orderModels[0].items[0].id).toBe(order.items[0].id);
    expect(orderModels[0].items[0].name).toBe(order.items[0].name);
    expect(orderModels[0].items[0].price).toBe(order.items[0].price);
    expect(orderModels[0].items[0].quantity).toBe(order.items[0].quantity);
    expect(orderModels[0].items[0].productId).toBe(order.items[0].productId);
    // //second order item
    expect(orderModels[0].items[1].id).toBe(order.items[1].id);
    expect(orderModels[0].items[1].name).toBe(order.items[1].name);
    expect(orderModels[0].items[1].price).toBe(order.items[1].price);
    expect(orderModels[0].items[1].quantity).toBe(order.items[1].quantity);
    expect(orderModels[0].items[1].productId).toBe(order.items[1].productId);
  });
});
