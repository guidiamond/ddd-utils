export interface IGuardResult {
  succeeded: boolean;
  message?: string;
  failedArgName?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    let succeeded = guardResults.some((result) => result.succeeded === false);
    succeeded = !succeeded;

    return { succeeded };
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): IGuardResult {
    if (argument === null || argument === undefined || argument === '') {
      return {
        succeeded: false,
        message: `${argumentName}`,
      };
    }
    return { succeeded: true };
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): IGuardResult {
    for (let i = 0; i < args.length; i += 1) {
      const result = this.againstNullOrUndefined(
        args[i].argument,
        args[i].argumentName
      );
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string
  ): IGuardResult {
    let isValid = false;
    validValues.forEach((validValue) => {
      if (value === validValue) {
        isValid = true;
      }
    });

    if (isValid) return { succeeded: true };

    return {
      succeeded: false,
      message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
        validValues
      )}. Got "${value}".`,
    };
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return {
        succeeded: false,
        message: `${argumentName} is not within range ${min} to ${max}.`,
      };
    }
    return { succeeded: true };
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    let failingResult: any = null;
    numbers.forEach((num) => {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) {
        failingResult = numIsInRangeResult;
      }
    });

    if (failingResult) {
      return {
        succeeded: false,
        message: `${argumentName} is not within the range.`,
      };
    }
    return { succeeded: true };
  }
}
