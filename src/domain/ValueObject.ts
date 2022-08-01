interface IValueObjectProps {
  [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<T extends IValueObjectProps> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props); // freeze makes object immutable
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return this.props === vo.props;
  }
}
