export type UserType = undefined | null | {
    id: string;
    username: string;
    createdIds: string[];
    bookmarkedIds: string[];
}

export type UserProps = {
    user:UserType | undefined | null;
    setUser: (user:UserType | undefined | null) => void;
}