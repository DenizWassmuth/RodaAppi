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

export type CapoEventType  = null | undefined | {
    id: string,
    creatorId: string,
    seriesId: string,
    occurrenceIndex: number,
    creatorName: string,
    eventTitle: string,
    eventDescription: string,
    thumbnail: string,
    locationData: LocationDataType,
    eventStart: string,
    eventEnd: string,
    eventType: CapoEventEnumType,
    repRhythm: RepetitionRhythmEnumType
}

export type EventRegDto = {
    userId: string,
    userName: string | undefined | null,
    eventTitle: string,
    eventDescription: string,
    thumbnail: string,
    locationData: LocationDataType,
    eventStart: string,
    eventEnd: string,
    eventType: CapoEventEnumType,
    repRhythm: RepetitionRhythmEnumType,
    repUntil: string
}

export type EventFormValue = Omit<EventRegDto, "userId">;

export type EditScope = "ONLY_THIS" | "ALL_IN_SERIES" | "BEFORE_THIS" | "AFTER_THIS";

export type PartOfSeriesDto = null | undefined | {
    isPartOfSeries: boolean;
    hasBefore: boolean;
    hasAfter: boolean;
}
