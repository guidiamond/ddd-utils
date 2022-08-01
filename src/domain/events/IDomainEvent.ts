import { UniqueEntityID } from "../../utils/UniqueEntityID";

export interface IDomainEvent {
  dateTimeOccurred: Date;
  get aggregateId(): UniqueEntityID;
}
