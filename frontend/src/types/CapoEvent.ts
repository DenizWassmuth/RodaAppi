
export type LocationDataType = {
    country: string;
    state: string;
    city: string;
    street: string;
    streetNumber: string;
    specifics:string;
};

export type CapoEventType = {
    id: string;
    creatorId: string;
    creatorName: string;
    eventTitle: string;
    eventDescription: string;
    thumbnail: string;
    locationData: LocationDataType;
    eventStart: string;
    eventEnd: string;
    eventType: string;
    repRhythm: string;
}

