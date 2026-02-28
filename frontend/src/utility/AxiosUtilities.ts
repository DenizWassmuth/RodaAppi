import axios from "axios";
import type {CapoEventType, EditScope, PartOfSeriesDto} from "../types/CapoEvent.ts";
import type {CityData, CountryData, StateData} from "../types/GeoData.ts";

export async function fetchAllCapoEvents() {
  return await axios.get<CapoEventType[]>("/api/capoevent");
}

const capoApi:string = `/api/capoevent`;

export async function deleteCapoEvent(userId: string | undefined | null, eventId: string | undefined | null, editScope: EditScope) {

  if (eventId === null || eventId === undefined){
    console.log("eventId === null or undefined, cannot proceed to delete event");
    return;
  }

  if (userId === null || userId === undefined){
    console.log("userId === null or undefined, cannot proceed to delete event");
    return;
  }

  console.log("awaiting axios response for deleteEvent with id: ", eventId+ " and scope: ", editScope);

  await axios.delete(capoApi + `/delete/${userId}/${eventId}`, {params: { editScope: editScope },})
      .then((response) => {console.log(response)})
      .catch(error => console.log(error + ", axios responded with error for deleteEvent with eventId: ", eventId));
}

export async function checkIfPartOfSeries(capoEvent: CapoEventType, setPartOfSeries: (partOfSeries: PartOfSeriesDto) => void) {

  if (capoEvent === null) {
    console.log("cannot check if event is part of series, as event is not valid");
    return;
  }

  await axios.get(capoApi + `/${capoEvent?.id}/${capoEvent?.seriesId}/${capoEvent?.occurrenceIndex}`)
      .then((response) => {
        setPartOfSeries(response.data);
        console.log(response.data);
      })
      .catch(error => console.log("axios responded with error for checkIfPartOfSeries: " + error));
}

export async function bookmarkEvents(userId:string | undefined | null, eventId: string | undefined, isBookmarkedByUser:boolean) {

    if (!isBookmarkedByUser) {
        await axios.put(`/api/bookmarks/${userId}/${eventId}`)
            .then((response) => {
                console.log("event was added to bookmarks " + response.data);
            })
            .catch((error) => {
                console.log(error)
            });

        return;
    }

    await axios.delete(`/api/bookmarks/${userId}/${eventId}`)
        .then((response) => {
            console.log("event was removed from bookmarks " + response.data);
        })

}

export async function fetchCountries(setCountries:(countries: CountryData[]) => void) {
  await axios.get("api/geodata/countries")
        .then((r) => {
            setCountries(r.data);
            console.log("countries fetched:");
            console.log(r.data); })
        .catch(err=>
            console.log(err));
}

export async function fetchStates(setStates:(states: StateData[]) => void, countryCode:string) {
    await axios.get(`api/geodata/states`, {params: {countryCode:countryCode},})
        .then((r) => {
            setStates(r.data);
            console.log("states fetched:");
            console.log(r.data); })
        .catch(err=>
            console.log(err));
}

export async function fetchCities(setCities:(cites: CityData[]) => void, countryCode:string, stateCode:string) {
    await axios.get(`api/geodata/cities`, {params: {countryCode:countryCode, stateCode:stateCode},})
        .then((r) => {
            setCities(r.data);
            console.log("cities fetched:");
            console.log(r.data);
        })
        .catch(err=>
            console.log(err)
        );
}