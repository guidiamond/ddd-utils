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
    raw: T[],
    toDomain: (entity: T) => Either<Result<DomainError>, Result<K>>,
    factoryCreator: (entities: K[]) => J
  ): Either<Result<DomainError>, Result<J>> {
    // Run all raw objects against the domain's mapper
    const results = raw.map((c) => toDomain(c));

    // Check if any of the objects got a validation error
    const loansOrError = results.filter((c) => c.isLeft());

    // Return first error found to the caller
    if (loansOrError.length > 0) {
      const errorResult = loansOrError[0].value as Result<DomainError>;
      return left(errorResult);
    }

    // Get the result of the mapper() calls
    const loansDomain = results.map((c) => c.value.getValue()) as K[];

    // Create the WatchedList Entity and return it
    const loans = factoryCreator(loansDomain);

    return right(Result.ok(loans));
  }

  public static toDTO<T, K>(
    entities: WatchedList<T>,
    toDTO: (entity: T) => K
  ): K[] {
    return entities.items.map((c) => toDTO(c));
  }
}
