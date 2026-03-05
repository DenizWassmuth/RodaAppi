export function login() {
    const host: string =
        globalThis.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : globalThis.location.origin;
    window.open(host + "/oauth2/authorization/github", "_self");
}

export function logout() {
    const host: string =
        globalThis.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : globalThis.location.origin;
    window.open(host + "/logout", "_self");
}