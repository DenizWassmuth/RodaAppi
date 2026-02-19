import axios from "axios";
import type {CapoEventType, DeleteScope} from "../types/CapoEvent.ts";
import {type NavigateFunction} from "react-router-dom";

export async function fetchAllCapoEvents() {
  return await axios.get<CapoEventType[]>("/api/capoevent");
}

export async function deleteCapoEvent(userId: string | undefined | null, eventId: string, deleteScope: DeleteScope, fetchEvents: () => Promise<void>, nav: NavigateFunction, path: string) {
  console.log("awaiting axios response for deleteEvent with id: ", eventId + " and scope: ", deleteScope);
  await axios.delete(`/api/capoevent/delete/${userId}/${eventId}`, {params: { deleteScope },})
      .then(() => fetchEvents())
      .then(() => nav(path))
      .catch(error => console.log(error + ", axios responded with error for deleteEvent with eventId: ", eventId));
}