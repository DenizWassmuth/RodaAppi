export type AppUser = undefined | null | {
    id: string;
    username: string;
    createdIds: string[];
    bookmarkedIds: string[];
}

export type UserProps = {
    user:AppUser | undefined | null;
    setUser: (user:AppUser | undefined | null) => void;
}