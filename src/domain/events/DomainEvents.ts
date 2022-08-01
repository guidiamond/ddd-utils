import { IDomainEvent } from "./IDomainEvent";
import { AggregateRoot } from "../AggregateRoot";
import { UniqueEntityID } from "../../utils/UniqueEntityID";

interface IHandlersMap {
  [key: string]: ((event: IDomainEvent) => void)[];
}

export class DomainEvents {
  private static handlersMap: IHandlersMap = {};

  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * @method markAggregateForDispatch
   * @static
   * @desc Called by aggregate root objects that have created domain
   * events to eventually be dispatched when the infrastructure commits
   * the unit of work.
   */

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: IDomainEvent) =>
      this.dispatch(event)
    );
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID
  ): AggregateRoot<any> {
    const found = this.markedAggregates.find((aggregate) =>
      aggregate.id.equals(id)
    ) as AggregateRoot<any>;

    return found;
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(
    callback: (event: any) => void,
    eventClassName: string
  ): void {
    if (!this.handlersMap.hasOwnProperty(eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  private static dispatch(event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: any[] = this.handlersMap[eventClassName];
      handlers.forEach((handler) => handler(event));
    }
  }
}
