export type AppUserType = undefined | null | {
    id: string | undefined | null;
    username: string | undefined | null;
}

export type UserProps = {
    appUser:AppUserType | undefined | null;
    setAppUser: (user:AppUserType | undefined | null) => void;
}