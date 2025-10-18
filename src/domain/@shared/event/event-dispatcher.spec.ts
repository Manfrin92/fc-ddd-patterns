import CustomerAddressIsChangedEvent from "../../customer/event/customer-address-is-changed";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import ConsoleLogWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/console.log-when-customer-address-is-changed.handler";
import ConsoleLog1WhenCustomerIsCreatedHandler from "../../customer/event/handler/console.log1-when-customer-is-created.handler";
import ConsoleLog2WhenCustomerIsCreatedHandler from "../../customer/event/handler/console.log2-when-customer-is-created.handler copy";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should register an event handler for customer created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLog1WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
  });

  it("should unregister an event handler for customer created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLog1WhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
  });

  it("should notify all event handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new ConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new ConsoleLog2WhenCustomerIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

    const customerCreatedEvent1 = new CustomerCreatedEvent({
      name: "Customer 1",
      description: "Customer from Country 1",
    });

    eventDispatcher.notify(customerCreatedEvent1);
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyEventHandler1).toHaveBeenCalled();
  });

  it("should register an event handler for customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerAddressIsChangedHandler();

    eventDispatcher.register("CustomerAddressIsChangedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"][0]).toMatchObject(eventHandler);
  });

  it("should unregister an event handler for customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerAddressIsChangedHandler();

    eventDispatcher.register("CustomerAddressIsChangedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"][0]).toMatchObject(eventHandler);

    eventDispatcher.unregister("CustomerAddressIsChangedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"].length).toBe(0);
  });

  it("should notify all event handlers when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerAddressIsChangedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler, "handle");
    eventDispatcher.register("CustomerAddressIsChangedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerAddressIsChangedEvent"][0]).toMatchObject(eventHandler);

    const customerAddressIsChangedEvent = new CustomerAddressIsChangedEvent({
      id: "123",
      name: "Customer 1",
      address: "Rua dos bobos nº 0",
    });

    eventDispatcher.notify(customerAddressIsChangedEvent);
    expect(spyEventHandler1).toHaveBeenCalled();
  });
});
