import type {CapoEventEnumType, CapoEventType} from "./CapoEvent.ts";

export type PageProps = {
    events:CapoEventType[];
    userId:string | null | undefined;
    fetchEvents: () => Promise<void>;
    typeOfEvent: CapoEventEnumType
}