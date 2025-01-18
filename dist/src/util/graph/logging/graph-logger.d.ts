import type { Command, Failable } from "../../../hooks/command";
import type { Logger } from "../../logging";
import { Level } from "../../logging";
import type { DirectedGraph } from "../graph";
interface IndentedLogMessage<V extends Failable> {
    indent: number;
    level: Level.ERROR | Level.WARNING;
    text: string;
    vertex: V;
}
type UnfinishedLogMessage<V extends Failable> = Pick<IndentedLogMessage<V>, "level" | "text"> & {
    includePredecessors: boolean;
};
export declare class ChainingGraphLogger<V extends Failable> {
    private readonly logger;
    private readonly hasPriority;
    constructor(logger: Logger, hasPriority?: (vertex: V) => boolean);
    logGraph(graph: DirectedGraph<V>): void;
    protected getLogMessage(vertex: V): undefined | UnfinishedLogMessage<V>;
    private computeLogMessageChain;
    private logMessageChain;
}
export declare class ChainingCommandGraphLogger extends ChainingGraphLogger<Command> {
    constructor(logger: Logger);
    protected getLogMessage(vertex: Command): undefined | UnfinishedLogMessage<Command>;
}
export {};
