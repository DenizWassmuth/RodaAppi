import axios from "axios";
import type {CapoEventType, DeleteScope, PartOfSeriesDto} from "../types/CapoEvent.ts";
import {type NavigateFunction} from "react-router-dom";

export async function fetchAllCapoEvents() {
  return await axios.get<CapoEventType[]>("/api/capoevent");
}

export async function deleteCapoEvent(userId: string | undefined | null, capoEvent: CapoEventType, deleteScope: DeleteScope, fetchEvents: () => Promise<void>, nav: NavigateFunction, path: string) {

  if (capoEvent === null) {
    console.log("capoEvent === null or undefined, cannot proceed to delete event");
    return;
  }

  if (capoEvent?.id === null || capoEvent?.id === undefined){
    console.log("eventId === null or undefined, cannot proceed to delete event");
    return;
  }

  if (userId === null || userId === undefined){
    console.log("userId === null or undefined, cannot proceed to delete event");
    return;
  }

  console.log("awaiting axios response for deleteEvent with id: ", capoEvent?.id + " and scope: ", deleteScope);
  await axios.delete(`/api/capoevent/delete/${userId}/${capoEvent?.id}`, {params: { deleteScope },})
      .then(() => fetchEvents())
      .then(() => nav(path))
      .catch(error => console.log(error + ", axios responded with error for deleteEvent with eventId: ", capoEvent?.id));
}

export async function checkIfPartOfSeries(capoEvent:CapoEventType,setPartOfSeries:(partOfSeries: PartOfSeriesDto) => void) {

  if (capoEvent === null) {
    console.log("cannot check if event is part of series, as event is not valid");
    return;
  }

  await axios.get(`api/capoevent/${capoEvent?.id}/${capoEvent?.seriesId}/${capoEvent?.occurrenceIndex}`)
      .then((response) => {
        setPartOfSeries(response.data);
      });
}