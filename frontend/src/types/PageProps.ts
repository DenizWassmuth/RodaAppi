import type {CapoEventEnumType, CapoEventType} from "./CapoEvent.ts";
import type {AppUserType} from "./AppUser.ts";

export type PageProps = {
    user:AppUserType | null | undefined;
    events:CapoEventType[];
    fetchEvents: () => Promise<void>;
    typeOfEvent: CapoEventEnumType;
    pathToSet:string;
    setCurrentPath: (path: string) => void;
}