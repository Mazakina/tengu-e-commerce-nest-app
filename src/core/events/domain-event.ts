import { UniqueEntityID } from '../primitives/unique-entity-id';

export interface DomainEvent {
  ocurredAt: Date;
  getAggregatedID(): UniqueEntityID;
}
