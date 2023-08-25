# DDD-utils

If you ever wanted to build a domain driven design application using NodeJS but didn't want to have to handle all the boilerplate and implementation details of its core components, then this **library** is for you!

## Features

### Result class

Similar to [Rust](https://doc.rust-lang.org/std/result/). It allows you to handle the result of operations at the top level rather than throwing everywhere in your code.

```Typescript
import { Result } from 'ddd-utils/utils/Result';

class User {
	name: string;
	age: number;
	public constructor(name,age) {
		this.name = name;
		this.age = age;
}

const buildUser = (raw) => {
	if (!raw.name || !raw.age) {
		return Result.fail('Missing Field'));
	}
	return Result.ok(new User(raw));
}

const raw = { name: "John", age:34 };
userResult = buildUser(raw);
if (userResult.isFailure) {
	throw new Error(userResult.getValue());
}
console.log('user created');
```

### Left, Right, Either

Left, Right and Either can be used to fill in the gaps that Result leaves when it comes to error handling.
The problem with just using **Result** is that it can only represent one type for its value, which can be a problem when you want to get the types for both an ok a fail result.

```Typescript
import { DomainError } from 'ddd-utils/domain/errors/DomainError';
import { Result, Either } from 'ddd-utils/utils/Result';

class User {...}

type IResponse = Either<Result<string>,Result<User>>;

const buildUser = (raw) => {
	if (!raw.name || !raw.age) {
		return left(Result.fail('Missing field!'));
	}
	return right(Result.ok(new User(raw)));
}

const raw = { name: "John", age:34 };
userResult = buildUser(raw);
if (userResult.isLeft()) {
	// Now getValue() will return the correct type (string)
	throw new Error(userResult.value.getValue());
}
const user = userResult.value.getValue(); // Will return type: User
console.log('user created', user.value);
```

### DDD Classses

The primary guide for this classes should be the [source code](https://github.com/guidiamond/ddd-utils/tree/main/src), which is pretty self explanatory, but here are some of the main classes exported in each layer of the library:

- **Domain:** AggregateRoot, Entity, ValueObject, with support for **Domain Events** :D. DomainError includes a default class for throwing custom errors if so desired.
- **Mappers**: They should be implemented by yourself, ideally as static classes, possible Mappings include: toDomain, toPersistence and toDTO. The idea is to make all entity operations in the domain as it should be the only one to encapsulate business rules. WatchedListMapper should be used in conjunction with a regular mapper in case you have an aggregate for multiple entities of the same type.
- **UseCase**: Implemented manually. UseCaseError includes a default class for throwing custom errors if so desired.

## Instalation

```bash
  $ npm install ddd-utils
```

## Any doubts?

Please visit our [issues](https://github.com/guidiamond/ddd-utils/issues).
