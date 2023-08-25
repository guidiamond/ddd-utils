import { DomainError } from "../domain/errors/DomainError";
import { Either, left, Result, right } from "../utils/Result";
import { WatchedList } from "../utils/WatchedList";

export class WatchedListMapper {
  public static toPersistence<T, K>(
    entities: WatchedList<T>,
    toPersistence: (entity: T) => K
  ): K[] {
    return entities.items.map((c) => toPersistence(c));
  }

  public static toDomain<T, K, J>(
    rawObjects: T[],
    toDomain: (entity: T) => Either<Result<DomainError>, Result<K>>,
    factoryCreator: (entities: K[]) => J
  ): Either<Result<DomainError>, Result<J>> {
    const domains: K[] = [];

    // Convert rawObjects to a list of domain entities
    for (const raw of rawObjects) {
      // Run raw objects against the domain's mapper
      const result = toDomain(raw);

      // If it gets any validation errors, return it to the caller
      if (result.isLeft()) {
        const error = result.value;
        return left(error);
      }

      domains.push(result.value.getValue());
    }

    // Convert cluster of domain entities into a WatchedList domain
    const watchedListDomain = factoryCreator(domains);

    return right(Result.ok(watchedListDomain));
  }

  public static toDTO<T, K>(
    entities: WatchedList<T>,
    toDTO: (entity: T) => K
  ): K[] {
    return entities.items.map((c) => toDTO(c));
  }
}
