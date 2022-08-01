export class Result<T> {
  public isSuccess: boolean;

  public isFailure: boolean;

  public error: T | string | undefined;

  private _value: T | undefined;

  public constructor(isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error"
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message"
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      return this.error as T;
    }

    return this._value as T;
  }

  public errorValue(): T {
    return this.error as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: any): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (let i = 0; i < results.length; i += 1) {
      if (results[i].isFailure) return results[i];
    }
    return Result.ok();
  }
}

export type Either<L, A> = Left<L, A> | Right<L, A>;

export type IGuardEither<L, A> = Either<L, A>[];

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }

  public static isLeftBulk(
    args: IGuardEither<any, Result<any>>
  ): Either<any, any> {
    for (let i = 0; i < args.length; i += 1) {
      if (args[i].isLeft()) {
        return args[i];
      }
    }
    return new Right(Result.ok("success"));
  }
}

export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }

  public static isLeftBulk(
    args: IGuardEither<any, Result<any>>
  ): Either<any, any> {
    for (let i = 0; i < args.length; i += 1) {
      if (args[i].isLeft()) {
        return args[i];
      }
    }
    return new Right(Result.ok("success"));
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
