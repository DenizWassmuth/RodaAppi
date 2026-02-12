export type AppUserType = undefined | null | {
    id: string;
    username: string;
}

export type UserProps = {
    appUser:AppUserType | undefined | null;
    setAppUser: (user:AppUserType | undefined | null) => void;
}