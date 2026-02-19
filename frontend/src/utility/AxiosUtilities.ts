import axios from "axios";
import type {CapoEventType} from "../types/CapoEvent.ts";
import {type NavigateFunction} from "react-router-dom";

export async function fetchAllCapoEvents() {
  return await axios.get<CapoEventType[]>("/api/capoevent");
}

export async function deleteCapoEvent(userId:string | undefined | null, eventId:string, fetchEvents: () => Promise<void>, nav:NavigateFunction, path:string) {

  await axios.delete(`/api/capoevent/delete/${userId}/${eventId}`)
      .then(() => fetchEvents()
          .then(() => nav(path))
          .catch(error => console.log( error + ", axios responded with error for deleteEvent with eventId: ", eventId)));
}