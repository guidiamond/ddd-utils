import { isUuid, uuid } from "uuidv4";
import { Identifier } from "./Identifier";

export type IdTypes = string | UniqueEntityID;

export class UniqueEntityID extends Identifier<string> {
  constructor(id: IdTypes = uuid()) {
    super(id.toString());
  }

  public static validate(id: string) {
    return isUuid(id);
  }
}
