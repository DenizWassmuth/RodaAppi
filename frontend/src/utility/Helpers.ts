

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

// dateInput needs to be sting of LocalDateTime(java)
export function addOneDayToDateInput(dateInput?: string): string | undefined {
    if (!dateInput) return undefined;

    const yyyyMmDd = dateInput.slice(0, 10);
    const [yStr, mStr, dStr] = yyyyMmDd.split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);

    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return undefined;

    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + 1);

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export function formatLocalDateTimeToDMonY(input?: string): string {
    if (!input) return "";

    const yyyyMmDd = input.slice(0, 10);
    const [yStr, mStr, dStr] = yyyyMmDd.split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);

    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return "";

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[m - 1];
    if (!monthName) return "";

    return `${d} ${monthName} ${y}`;
}

export function formatLocalDateTimeToHHmm(input?: string): string {
    if (!input) return "";

    const timePart = input.includes("T") ? input.split("T")[1] : input;

    const hh = timePart.slice(0, 2);
    const mm = timePart.slice(3, 5);

    if (hh.length !== 2 || mm.length !== 2) return "";

    return `${hh}:${mm}`;
}