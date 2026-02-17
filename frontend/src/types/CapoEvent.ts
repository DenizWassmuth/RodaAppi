export type CapoEventEnumType = "RODA" | "WORKSHOP" | "NONE" ;

export type RepetitionRhythmEnumType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";

export type LocationDataType = {
    country: string;
    state: string;
    city: string;
    street: string;
    streetNumber: string;
    specifics:string;
};

export type CapoEventType = {
    id: string,
    creatorId: string,
    creatorName: string,
    eventTitle: string,
    eventDescription: string,
    thumbnail: string;
    locationData: LocationDataType;
    eventStart: string;
    eventEnd: string;
    eventType: CapoEventEnumType;
    repRhythm: RepetitionRhythmEnumType;
}

export type CapoEventProps = {
    capoEvent: CapoEventType;
    setCapoEvent: (capoEvent: CapoEventType) => void;
}

export type EventRegDto = {
    userId: string,
    eventTitle: string,
    eventDescription: string,
    thumbnail: string,
    locationData: LocationDataType,
    eventStart: string,
    eventEnd: string,
    eventType: CapoEventEnumType,
    repRhythm: RepetitionRhythmEnumType
}

export type EventFormValue = Omit<EventRegDto, "userId">;