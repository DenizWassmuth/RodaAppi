

export function nowAsDateTimeLocal(): string {
    const d = new Date();
    d.setSeconds(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function nowAsDate(): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
}

export function nowAsTime(): string {
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMonth(0, 0);
    d.setFullYear(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${hh}:${min}`;
}

export function dateToStartOfDayLocalDateTime(date: string): string {
    if (!date) return "";
    return `${date}T00:00`;
}