import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressIsChangedEvent from "../customer-address-is-changed";

export default class ConsoleLogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<CustomerAddressIsChangedEvent>
{
  handle(event: CustomerAddressIsChangedEvent): void {
    console.log(
      `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`
    );
  }
}
