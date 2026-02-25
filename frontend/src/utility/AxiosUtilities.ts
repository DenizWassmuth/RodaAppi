import axios from "axios";
import type {CapoEventType, EditScope, PartOfSeriesDto} from "../types/CapoEvent.ts";

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

export async function checkIfPartOfSeries(capoEvent:CapoEventType,setPartOfSeries:(partOfSeries: PartOfSeriesDto) => void) {

  if (capoEvent === null) {
    console.log("cannot check if event is part of series, as event is not valid");
    return;
  }

  await axios.get(capoApi + `/${capoEvent?.id}/${capoEvent?.seriesId}/${capoEvent?.occurrenceIndex}`)
      .then((response) => {
        setPartOfSeries(response.data); console.log(response.data);
      })
      .catch(error => console.log("axios responded with error for checkIfPartOfSeries: " + error));
}