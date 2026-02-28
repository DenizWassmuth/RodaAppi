import axios from "axios";
import CapoEventForm from "../CapoEventForm.tsx";

import type { AppUserType } from "../../types/AppUser.ts";
import type {EventFormValue, EventRegDto} from "../../types/CapoEvent.ts";
import {useNavigate} from "react-router-dom";
import FrameModal from "../modals/FrameModal.tsx";
import {useState} from "react";
import type {CountryData} from "../../types/GeoData.ts";
import {fetchCountries} from "../../utility/AxiosUtilities.ts";

type Props = {
    user: AppUserType;
    fetchEvents: () => Promise<void | string>;
    onClosePath:string;
    countries:CountryData[]
    setCountries:(countries:CountryData[]) => void;

};

export default function CreateCapoEventPage({user, fetchEvents, onClosePath, countries, setCountries}:Readonly<Props>) {
    const empty: EventFormValue = {
        userName:user?.username,
        eventTitle: "",
        eventDescription: "",
        thumbnail: "",
        locationData: {
            country: "",
            state: "",
            city: "",
            street: "",
            streetNumber: "",
            specifics: "",
        },
        eventStart: "",
        eventEnd: "",
        eventType: "RODA",
        repRhythm: "ONCE",
        repUntil: ""
    };

    const [openFormModal, setOpenFormModal] = useState(true);
    const nav = useNavigate();

    if (!openFormModal) {
        return null;
    }

    const isLoggedIn = user !== null && user !== undefined;

    if(countries.length <= 0){
        fetchCountries(setCountries)
            .then()
    }

    async function submit(value: EventFormValue) {
       if (!user?.id){
           throw new Error("Not logged in");
       }

        const dto: EventRegDto = {
            userId: String(user?.id),
            ...value,
        };

        setOpenFormModal(false);

        await axios.post("/api/capoevent", dto)
            .then(() => fetchEvents()
                .then(() => nav("/loggedin")));
    }

    function onClose(){
        setOpenFormModal(false);
        nav(onClosePath)
    }

    return (
        <>
            {!isLoggedIn && (
                <div className="create-event__alert create-event__alert--error">
                    You are not logged in. Please log in to create events.
                </div>
            )}

            {isLoggedIn && openFormModal && (
                <FrameModal title={""} open={openFormModal} onClose={() => onClose()}>
                    <div>
                        <CapoEventForm
                            submitText="Create"
                            initialValue={empty}
                            submit={submit}
                            bEditMode={false}
                            partOfSeries={null}
                            countries={countries}
                        />
                    </div>
                </FrameModal>)
            }
        </>
    );
}