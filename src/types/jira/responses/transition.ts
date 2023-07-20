import { FieldMetaCloud, FieldMetaServer } from "./fieldMeta";
import { StatusDetailsCloud, StatusDetailsServer } from "./statusDetails";

type Transition<FieldMetaType, StatusDetailsType> = {
    /**
     * The ID of the issue transition. Required when specifying a transition to undertake.
     */
    id?: string;
    /**
     * The name of the issue transition.
     */
    name?: string;
    /**
     * Details of the issue status after the transition.
     */
    to?: StatusDetailsType;
    /**
     * Details of the fields associated with the issue transition screen. Use this information to
     * populate `fields` and `update` in a transition request.
     */
    fields?: {
        [k: string]: FieldMetaType;
    };
    /**
     * Expand options that include additional transition details in the response.
     */
    expand?: string;
};
export type TransitionServer = Transition<FieldMetaServer, StatusDetailsServer> & {
    opsbarSequence?: number;
};
export type TransitionCloud = Transition<FieldMetaCloud, StatusDetailsCloud> & {
    /**
     * Whether there is a screen associated with the issue transition.
     */
    hasScreen?: boolean;
    /**
     * Whether the transition is available to be performed.
     */
    isAvailable?: boolean;
    /**
     * Whether the issue has to meet criteria before the issue transition is applied.
     */
    isConditional?: boolean;
    /**
     * Whether the issue transition is global, that is, the transition is applied to issues
     * regardless of their status.
     */
    isGlobal?: boolean;
    /**
     * Whether this is the initial issue transition for the workflow.
     */
    isInitial?: boolean;
    looped?: boolean;
};
