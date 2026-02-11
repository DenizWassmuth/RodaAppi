type UserProps = {
    userName:string | undefined | null;
}

export default function LoggedInPage(props:Readonly<UserProps>) {

    return <div>logged in as <p>{props.userName}</p></div>
}