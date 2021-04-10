import { omit } from "lodash";
import { ConnectionArguments } from "./interfaces/connection-arguments.interface";

export class RelayProvider {
  public clearConnectionArguments<A extends ConnectionArguments>(connectionArguments: A): Omit<A, 'before' | 'after' | 'first' | 'last'> {
    const clearedArguments = omit(connectionArguments, ['before', 'after', 'first', 'last'])

    return clearedArguments
  }
}